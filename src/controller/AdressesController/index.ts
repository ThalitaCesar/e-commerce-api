import express from "express";
import { Request, Response} from "express";
import { AdressesData } from "../../data/AdressesData";
import { Adresses } from "../../models/AdressesModel";
import { GenerateId } from "../../services/GenerateId";

export class AdressesController {

// Criar endereço do usuário

  async postAdresses(req: Request, res: Response) {
    let errorstatus = 500;
    try {
      const id = new GenerateId().generateId();
      const {  
        cep,
        street,
        district,
        city,
        number,
        state,
        complement,
        user_id} = req.body;
      if ( !cep|| !street || !district || !city || !number  || !user_id  || !number) {
        errorstatus = 422;
        throw new Error("Digite os parametros necessarios ");
      }
      const newAdresses = new Adresses(
        id,
        cep,
        street,
        district,
        city,
        complement,
        state,
        number,
        user_id
      );
      const adressesData = new AdressesData();
      const result = await adressesData.createAdresses(newAdresses);
      console.log(result);
      res.status(202).send({ result: result });
    } catch (error:any) {
      res.status(errorstatus).send(error.message || error.sqlMessage);
    }
  }

// Pegar todos os endereços do usuário

  async getAllAdressesByUser(req: Request, res: Response) {
    let errorstatus = 500;
    const user_id = req.params.id;
    try {
      const adresses = await new AdressesData().getAllAdressesByUser(user_id);
      res.status(200).send({ Result: adresses });
    } catch (error:any) {
      res.status(errorstatus).send(error.message || error.sqlMessage);
    }
  }

//  Editar Endereço

  async updateAdresses(req: Request, res: Response) {
    let errorstatus = 500;
    try {
      const { 
        id,
        cep,
        street,
        district,
        city,
        number,
        state,
        complement,
       } = req.body;
      if (!id) {
        errorstatus = 422;
        throw new Error("Parâmetro id é obrigatório");
      }
      const result = await new AdressesData().updateAdresses(
        id,
        cep,
        street,
        district,
        city,
        number,
        state,
        complement,
      );
      res.status(201).send(result);
    } catch (error:any) {
      res.status(errorstatus).send(error.message || error.sqlMessage);
    }
  }

// Deletar Endereço

  async deleteAdresses(req: Request, res: Response) {
    let errorstatus = 500;
    try {
      const id = req.params.id;
      const result = await new AdressesData().deleteAdresses(id);
      res.status(200).send({ result: result });
    } catch (error:any) {
      res.status(errorstatus).send(error.message || error.sqlMessage);
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
 *       500:
 *         description: Erro interno
 */
adressesRouter.get('/getadresses/:id', adressesController.getAllAdressesByUser)

/**
 * @swagger
 * /adresses/postadresses/:
 *   post:
 *     summary: Cria um endereço para o usuário
 *     tags: [Adresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cep, street, district, city, number, user_id]
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
 *               user_id:
 *                 type: string
 *     responses:
 *       202:
 *         description: Endereço criado com sucesso
 *       422:
 *         description: Parâmetros obrigatórios não informados
 *       500:
 *         description: Erro interno
 */
adressesRouter.post('/postadresses/', adressesController.postAdresses)

/**
 * @swagger
 * /adresses/updateadresses:
 *   put:
 *     summary: Atualiza um endereço
 *     tags: [Adresses]
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
 *       422:
 *         description: Parâmetro id não informado
 *       500:
 *         description: Erro interno
 */
adressesRouter.put('/updateadresses', adressesController.updateAdresses)

/**
 * @swagger
 * /adresses/deleteadresses/{id}:
 *   delete:
 *     summary: Exclui um endereço
 *     tags: [Adresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Endereço excluído com sucesso
 *       500:
 *         description: Erro interno
 */
adressesRouter.delete('/deleteadresses/:id', adressesController.deleteAdresses)