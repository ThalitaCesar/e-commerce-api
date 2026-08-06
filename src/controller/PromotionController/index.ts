import express from "express";
import { NextFunction, Request, Response } from "express";
import { PromotionData } from "../../data/PromotionData";
import { Promotion } from "../../models/PromotionModel";
import { GenerateId } from "../../services/GenerateId";
import { authenticate, requireAdmin } from "../../middlewares/authMiddleware";
import { createPromotionSchema, updatePromotionSchema } from "../../validators/promotionValidator";

export class PromotionController {

// Criar promoção
  async postPromotion(req: Request, res: Response, next: NextFunction) {
    try {
      const id = new GenerateId().generateId();
      const validated = createPromotionSchema.parse(req.body);
      const newPromotion = new Promotion(
        id,
        validated.name,
        validated.discountPercent,
        validated.startDate,
        validated.endDate,
        validated.active,
      );
      const result = await new PromotionData().createPromotion(newPromotion);
      res.status(202).send({ result: result });
    } catch (error) {
      next(error);
    }
  }

// Listar todas as promoções (gestão do admin)

  async getAllPromotions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await new PromotionData().getAllPromotions();
      res.status(200).send({ Result: result });
    } catch (error) {
      next(error);
    }
  }

// Pegar a promoção vigente agora, se houver (usado pelo front-end da loja)

  async getActivePromotion(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await new PromotionData().getActivePromotion();
      res.status(200).send({ Result: result });
    } catch (error) {
      next(error);
    }
  }

// Editar promoção

  async updatePromotion(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const validated = updatePromotionSchema.parse(req.body);
      const result = await new PromotionData().updatePromotion(
        id,
        validated.name,
        validated.discountPercent,
        validated.startDate,
        validated.endDate,
        validated.active,
      );
      res.status(201).send({ result: result });
    } catch (error) {
      next(error);
    }
  }

// Deletar promoção

  async deletePromotion(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await new PromotionData().deletePromotion(id);
      res.status(200).send({ result: result });
    } catch (error) {
      next(error);
    }
  }
}

// Rotas

export const promotionRouter = express.Router();

const promotionController = new PromotionController();

/**
 * @swagger
 * tags:
 *   name: Promotion
 *   description: Promoções com desconto percentual válidas por período, aplicadas a todos os produtos
 */

/**
 * @swagger
 * /promotion/getactivepromotion:
 *   get:
 *     summary: Retorna a promoção vigente hoje, se houver
 *     tags: [Promotion]
 *     responses:
 *       200:
 *         description: Promoção vigente (ou null se nenhuma estiver ativa)
 *       500:
 *         description: Erro interno
 */
promotionRouter.get('/getactivepromotion', promotionController.getActivePromotion);

/**
 * @swagger
 * /promotion/getpromotions:
 *   get:
 *     summary: Lista todas as promoções cadastradas (admin)
 *     tags: [Promotion]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de promoções
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       500:
 *         description: Erro interno
 */
promotionRouter.get('/getpromotions', authenticate, requireAdmin, promotionController.getAllPromotions);

/**
 * @swagger
 * /promotion/postpromotion:
 *   post:
 *     summary: Cria uma promoção agendada (admin)
 *     tags: [Promotion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, discountPercent, startDate, endDate]
 *             properties:
 *               name:
 *                 type: string
 *               discountPercent:
 *                 type: number
 *                 description: Percentual de desconto (ex. 20 para 20%)
 *               startDate:
 *                 type: string
 *                 description: Data de início no formato AAAA-MM-DD
 *               endDate:
 *                 type: string
 *                 description: Data de término no formato AAAA-MM-DD
 *               active:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       202:
 *         description: Promoção criada com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       409:
 *         description: Já existe uma promoção ativa nesse período
 *       500:
 *         description: Erro interno
 */
promotionRouter.post('/postpromotion', authenticate, requireAdmin, promotionController.postPromotion);

/**
 * @swagger
 * /promotion/updatepromotion/{id}:
 *   put:
 *     summary: Atualiza uma promoção (admin)
 *     tags: [Promotion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               discountPercent:
 *                 type: number
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Promoção atualizada com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       404:
 *         description: Promoção não encontrada
 *       409:
 *         description: Já existe uma promoção ativa nesse período
 *       500:
 *         description: Erro interno
 */
promotionRouter.put('/updatepromotion/:id', authenticate, requireAdmin, promotionController.updatePromotion);

/**
 * @swagger
 * /promotion/deletepromotion/{id}:
 *   delete:
 *     summary: Exclui uma promoção (admin)
 *     tags: [Promotion]
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
 *         description: Promoção excluída com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       404:
 *         description: Promoção não encontrada
 *       500:
 *         description: Erro interno
 */
promotionRouter.delete('/deletepromotion/:id', authenticate, requireAdmin, promotionController.deletePromotion);
