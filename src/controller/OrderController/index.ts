import express from "express";
import { NextFunction, Request, Response } from "express";
import { OrderData } from "../../data/OrderData";
import { Order } from "../../models/OrderModel";
import { ROLES } from "../../models/UserModel";
import { GenerateId } from "../../services/GenerateId";
import { AppError } from "../../utils/AppError";
import { authenticate, requireSelfOrAdmin } from "../../middlewares/authMiddleware";
import { createOrderSchema } from "../../validators/orderValidator";

export class OrderController {

// Criar pedido
  async postOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = new GenerateId().generateId();
      const validated = createOrderSchema.parse(req.body);
      const newOrder = new Order(
        id,
        validated.name,
        validated.folder,
        validated.size,
        validated.price,
        req.user!.id
      );
      const orderdata = new OrderData();
      const result = await orderdata.createOrder(newOrder);
      res.status(202).send({ result: result });
    } catch (error) {
      next(error);
    }
  }

// Pegar todos os pedidos do usuário

  async getOrdersByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const order = await new OrderData().getAllOrderByUser(id);
      res.status(200).send({ Result: order });
    } catch (error) {
      next(error);
    }
  }

// Deletar pedido

  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const orderData = new OrderData();
      const order = await orderData.getOrderById(id);
      if (!order) {
        throw new AppError("Pedido não encontrado", 404);
      }
      if (order.user_id !== req.user!.id && req.user!.role !== ROLES.ADMIN) {
        throw new AppError("Acesso negado", 403);
      }
      const result = await orderData.deleteOrder(id);
      res.status(200).send({ result: result });
    } catch (error) {
      next(error);
    }
  }
}

// Rotas

export const orderRouter = express.Router()

const orderController = new OrderController()

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Pedidos dos usuários
 */

/**
 * @swagger
 * /order/getorderbyuser/{id}:
 *   get:
 *     summary: Lista os pedidos de um usuário
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id do usuário
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno
 */
orderRouter.get('/getorderbyuser/:id', authenticate, requireSelfOrAdmin((req) => req.params.id), orderController.getOrdersByUser)

/**
 * @swagger
 * /order/postorder:
 *   post:
 *     summary: Cria um novo pedido para o usuário autenticado
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, folder, size, price]
 *             properties:
 *               name:
 *                 type: string
 *               folder:
 *                 type: string
 *               size:
 *                 type: string
 *               price:
 *                 type: string
 *     responses:
 *       202:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token não informado ou inválido
 *       500:
 *         description: Erro interno
 */
orderRouter.post('/postorder', authenticate, orderController.postOrder)

/**
 * @swagger
 * /order/deleteorder/{id}:
 *   delete:
 *     summary: Exclui um pedido
 *     tags: [Order]
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
 *         description: Pedido excluído com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro interno
 */
orderRouter.delete('/deleteorder/:id', authenticate, orderController.deleteOrder)
