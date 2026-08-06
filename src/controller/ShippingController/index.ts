import express from "express";
import { NextFunction, Request, Response } from "express";
import { ShippingService } from "../../services/ShippingService";
import { quoteShippingSchema } from "../../validators/shippingValidator";

export class ShippingController {

// Cotar frete para uma lista de produtos + CEP de destino
  async quote(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = quoteShippingSchema.parse(req.body);
      const result = await new ShippingService().calculate(validated);
      res.status(200).send({ Result: result });
    } catch (error) {
      next(error);
    }
  }
}

// Rotas

export const shippingRouter = express.Router();

const shippingController = new ShippingController();

/**
 * @swagger
 * tags:
 *   name: Shipping
 *   description: Cotação de frete via Melhor Envio
 */

/**
 * @swagger
 * /shipping/quote:
 *   post:
 *     summary: Cota o frete de uma lista de produtos para um CEP de destino
 *     tags: [Shipping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [destinationPostalCode, items]
 *             properties:
 *               destinationPostalCode:
 *                 type: string
 *                 description: CEP de destino, 8 dígitos sem traço
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [productId, quantity]
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Opções de frete disponíveis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       service:
 *                         type: string
 *                       company:
 *                         type: string
 *                       price:
 *                         type: string
 *                       deliveryTime:
 *                         type: integer
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Produto não encontrado
 *       422:
 *         description: Produto sem peso/dimensões cadastrados
 *       500:
 *         description: Erro interno ou CEP de origem da loja não configurado
 *       502:
 *         description: Falha ao consultar o serviço de frete
 */
shippingRouter.post('/quote', shippingController.quote);
