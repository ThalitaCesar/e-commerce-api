import express from "express";
import { NextFunction, Request, Response } from "express";
import { OrderData } from "../../data/OrderData";
import { PaymentData } from "../../data/PaymentData";
import { UserData } from "../../data/UserData";
import { ROLES } from "../../models/UserModel";
import { GenerateId } from "../../services/GenerateId";
import { MercadoPagoService } from "../../services/MercadoPagoService";
import { AppError } from "../../utils/AppError";
import { authenticate } from "../../middlewares/authMiddleware";
import { createPaymentSchema } from "../../validators/paymentValidator";

const APPROVED_ORDER_STATUSES = ["approved", "authorized"];
const FAILED_ORDER_STATUSES = ["rejected", "cancelled"];

export class PaymentController {

  // Criar pagamento de um pedido
  async payOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.orderId;
      const orderData = new OrderData();
      const order = await orderData.getOrderById(orderId);
      if (!order) {
        throw new AppError("Pedido não encontrado", 404);
      }
      if (order.user_id !== req.user!.id && req.user!.role !== ROLES.ADMIN) {
        throw new AppError("Acesso negado", 403);
      }

      const paymentData = new PaymentData();
      const activePayment = await paymentData.getActivePaymentByOrder(orderId);
      if (activePayment) {
        throw new AppError("Já existe um pagamento em andamento ou aprovado para este pedido", 409);
      }

      const user = await new UserData().getById(order.user_id);
      if (!user) {
        throw new AppError("Usuário do pedido não encontrado", 404);
      }

      const validated = createPaymentSchema.parse(req.body);
      const amount = parseFloat(order.price);
      if (!amount || amount <= 0) {
        throw new AppError("Valor do pedido inválido", 422);
      }

      const paymentId = new GenerateId().generateId();
      const mercadoPago = new MercadoPagoService();

      let mpResponse;
      if (validated.method === "PIX") {
        if (!user.cpf) {
          throw new AppError("Cadastre seu CPF no perfil antes de pagar via PIX", 422);
        }
        mpResponse = await mercadoPago.createPixPayment({
          amount,
          description: `Pedido ${order.name}`,
          payer: { email: user.email, cpf: user.cpf },
          idempotencyKey: paymentId,
        });
      } else {
        const installments = validated.method === "DEBIT_CARD" ? 1 : validated.installments;
        mpResponse = await mercadoPago.createCardPayment({
          token: validated.token,
          paymentMethodId: validated.paymentMethodId,
          installments,
          amount,
          description: `Pedido ${order.name}`,
          payer: { email: user.email, cpf: user.cpf },
          idempotencyKey: paymentId,
        });
      }

      const status = mpResponse.status || "pending";
      await paymentData.createPayment({
        id: paymentId,
        order_id: orderId,
        user_id: order.user_id,
        method: validated.method,
        status,
        amount,
        external_id: String(mpResponse.id),
        qr_code: mpResponse.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: mpResponse.point_of_interaction?.transaction_data?.qr_code_base64,
        ticket_url: mpResponse.point_of_interaction?.transaction_data?.ticket_url,
      });

      if (APPROVED_ORDER_STATUSES.includes(status)) {
        await orderData.updateStatus(orderId, "PAID");
      } else if (FAILED_ORDER_STATUSES.includes(status)) {
        await orderData.updateStatus(orderId, "PAYMENT_FAILED");
      }

      res.status(201).send({
        result: {
          paymentId,
          status,
          qrCode: mpResponse.point_of_interaction?.transaction_data?.qr_code,
          qrCodeBase64: mpResponse.point_of_interaction?.transaction_data?.qr_code_base64,
          ticketUrl: mpResponse.point_of_interaction?.transaction_data?.ticket_url,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Buscar um pagamento específico
  async getPaymentById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const payment = await new PaymentData().getById(id);
      if (!payment) {
        throw new AppError("Pagamento não encontrado", 404);
      }
      if (payment.user_id !== req.user!.id && req.user!.role !== ROLES.ADMIN) {
        throw new AppError("Acesso negado", 403);
      }
      res.status(200).send({ result: payment });
    } catch (error) {
      next(error);
    }
  }

  // Listar pagamentos de um pedido
  async getPaymentsByOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.orderId;
      const order = await new OrderData().getOrderById(orderId);
      if (!order) {
        throw new AppError("Pedido não encontrado", 404);
      }
      if (order.user_id !== req.user!.id && req.user!.role !== ROLES.ADMIN) {
        throw new AppError("Acesso negado", 403);
      }
      const payments = await new PaymentData().getByOrderId(orderId);
      res.status(200).send({ Result: payments });
    } catch (error) {
      next(error);
    }
  }

  // Webhook do Mercado Pago
  async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const mercadoPago = new MercadoPagoService();
      const valid = mercadoPago.verifyWebhookSignature({
        xSignature: req.headers["x-signature"] as string | undefined,
        xRequestId: req.headers["x-request-id"] as string | undefined,
        dataId: req.query["data.id"] as string | undefined,
      });
      if (!valid) {
        throw new AppError("Assinatura inválida", 401);
      }

      if (req.body?.type !== "payment") {
        return res.status(200).send();
      }

      const externalId = String(req.body?.data?.id || req.query["data.id"]);
      const mpPayment = await mercadoPago.getPayment(externalId);
      const status = mpPayment.status || "pending";

      const paymentData = new PaymentData();
      const localPayment = await paymentData.getByExternalId(externalId);
      if (!localPayment) {
        console.error(`Webhook: pagamento externo ${externalId} não encontrado localmente`);
        return res.status(200).send();
      }

      await paymentData.updateStatus(localPayment.id, status);

      if (APPROVED_ORDER_STATUSES.includes(status)) {
        await new OrderData().updateStatus(localPayment.order_id, "PAID");
      } else if (FAILED_ORDER_STATUSES.includes(status)) {
        await new OrderData().updateStatus(localPayment.order_id, "PAYMENT_FAILED");
      }

      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
}

// Rotas

export const paymentRouter = express.Router();

const paymentController = new PaymentController();

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Pagamento de pedidos via Mercado Pago (cartão de crédito, débito e PIX)
 */

/**
 * @swagger
 * /payment/orders/{orderId}:
 *   post:
 *     summary: Cria um pagamento para um pedido do usuário autenticado
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [method]
 *             properties:
 *               method:
 *                 type: string
 *                 enum: [CREDIT_CARD, DEBIT_CARD, PIX]
 *               token:
 *                 type: string
 *                 description: Token do cartão gerado pelo SDK JS do Mercado Pago (obrigatório para CREDIT_CARD/DEBIT_CARD)
 *               paymentMethodId:
 *                 type: string
 *                 description: Devolvido pelo SDK JS ao tokenizar o cartão (ex. "visa", "master")
 *               installments:
 *                 type: integer
 *                 description: Só usado em CREDIT_CARD; DEBIT_CARD é sempre 1x
 *     responses:
 *       201:
 *         description: Pagamento criado (PIX volta com QR code; cartão volta com o status)
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pedido não encontrado
 *       409:
 *         description: Já existe um pagamento ativo para esse pedido
 *       422:
 *         description: Perfil sem CPF cadastrado (obrigatório para PIX) ou valor inválido
 *       500:
 *         description: Erro interno
 */
paymentRouter.post('/orders/:orderId', authenticate, paymentController.payOrder);

/**
 * @swagger
 * /payment/{id}:
 *   get:
 *     summary: Busca um pagamento pelo id
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pagamento encontrado
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pagamento não encontrado
 *       500:
 *         description: Erro interno
 */
paymentRouter.get('/:id', authenticate, paymentController.getPaymentById);

/**
 * @swagger
 * /payment/order/{orderId}:
 *   get:
 *     summary: Lista os pagamentos de um pedido
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pagamentos
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro interno
 */
paymentRouter.get('/order/:orderId', authenticate, paymentController.getPaymentsByOrder);

/**
 * @swagger
 * /payment/webhook:
 *   post:
 *     summary: Notificação de status de pagamento do Mercado Pago
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Notificação processada
 *       401:
 *         description: Assinatura inválida
 */
paymentRouter.post('/webhook', paymentController.webhook);
