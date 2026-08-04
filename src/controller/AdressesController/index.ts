import express from "express";
import { NextFunction, Request, Response } from "express";
import { AdressesData } from "../../data/AdressesData";
import { Adresses } from "../../models/AdressesModel";
import { ROLES } from "../../models/UserModel";
import { GenerateId } from "../../services/GenerateId";
import { AppError } from "../../utils/AppError";
import { authenticate, requireSelfOrAdmin } from "../../middlewares/authMiddleware";
import { createAdressesSchema, updateAdressesSchema } from "../../validators/adressesValidator";

export class AdressesController {

// Criar endereço do usuário

  async postAdresses(req: Request, res: Response, next: NextFunction) {
    try {
      const id = new GenerateId().generateId();
      const validated = createAdressesSchema.parse(req.body);
      const newAdresses = new Adresses(
        id,
        validated.cep,
        validated.street,
        validated.district,
        validated.city,
        validated.complement,
        validated.state,
        validated.number,
        req.user!.id
      );
      const adressesData = new AdressesData();
      const result = await adressesData.createAdresses(newAdresses);
      res.status(202).send({ result: result });
    } catch (error) {
      next(error);
    }
  }

// Pegar todos os endereços do usuário

  async getAllAdressesByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.params.id;
      const adresses = await new AdressesData().getAllAdressesByUser(user_id);
      res.status(200).send({ Result: adresses });
    } catch (error) {
      next(error);
    }
  }

//  Editar Endereço

  async updateAdresses(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = updateAdressesSchema.parse(req.body);
      const adressesData = new AdressesData();
      const adresses = await adressesData.getAdressesById(validated.id);
      if (!adresses) {
        throw new AppError("Endereço não encontrado", 404);
      }
      if (adresses.user_id !== req.user!.id && req.user!.role !== ROLES.ADMIN) {
        throw new AppError("Acesso negado", 403);
      }
      const result = await adressesData.updateAdresses(
        validated.id,
        validated.cep as string,
        validated.street as string,
        validated.district as string,
        validated.city as string,
        validated.number as string,
        validated.state as string,
        validated.complement,
      );
      res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  }

// Deletar Endereço

  async deleteAdresses(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const adressesData = new AdressesData();
      const adresses = await adressesData.getAdressesById(id);
      if (!adresses) {
        throw new AppError("Endereço não encontrado", 404);
      }
      if (adresses.user_id !== req.user!.id && req.user!.role !== ROLES.ADMIN) {
        throw new AppError("Acesso negado", 403);
      }
      const result = await adressesData.deleteAdresses(id);
      res.status(200).send({ result: result });
    } catch (error) {
      next(error);
    }
  }
}

// Rotas

export const adressesRouter = express.Router()

const adressesController = new AdressesController()

/**
 * @swagger
 * tags:
 *   name: Adresses
 *   description: Endereços dos usuários
 */

/**
 * @swagger
 * /adresses/getadresses/{id}:
 *   get:
 *     summary: Lista os endereços de um usuário
 *     tags: [Adresses]
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
 *         description: Lista de endereços
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Adresses'
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno
 */
adressesRouter.get('/getadresses/:id', authenticate, requireSelfOrAdmin((req) => req.params.id), adressesController.getAllAdressesByUser)

/**
 * @swagger
 * /adresses/postadresses/:
 *   post:
 *     summary: Cria um endereço para o usuário autenticado
 *     tags: [Adresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cep, street, district, city, number]
 *             properties:
 *               cep:
 *                 type: string
 *               street:
 *                 type: string
 *               district:
 *                 type: string
 *               city:
 *                 type: string
 *               number:
 *                 type: string
 *               state:
 *                 type: string
 *               complement:
 *                 type: string
 *     responses:
 *       202:
 *         description: Endereço criado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token não informado ou inválido
 *       500:
 *         description: Erro interno
 */
adressesRouter.post('/postadresses/', authenticate, adressesController.postAdresses)

/**
 * @swagger
 * /adresses/updateadresses:
 *   put:
 *     summary: Atualiza um endereço do usuário autenticado
 *     tags: [Adresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: string
 *               cep:
 *                 type: string
 *               street:
 *                 type: string
 *               district:
 *                 type: string
 *               city:
 *                 type: string
 *               number:
 *                 type: string
 *               state:
 *                 type: string
 *               complement:
 *                 type: string
 *     responses:
 *       201:
 *         description: Endereço atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Endereço não encontrado
 *       500:
 *         description: Erro interno
 */
adressesRouter.put('/updateadresses', authenticate, adressesController.updateAdresses)

/**
 * @swagger
 * /adresses/deleteadresses/{id}:
 *   delete:
 *     summary: Exclui um endereço
 *     tags: [Adresses]
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
 *         description: Endereço excluído com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Endereço não encontrado
 *       500:
 *         description: Erro interno
 */
adressesRouter.delete('/deleteadresses/:id', authenticate, adressesController.deleteAdresses)
