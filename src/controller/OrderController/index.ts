import express from "express";
import { Request, Response} from "express";
import { OrderData } from "../../data/OrderData";
import { Order } from "../../models/OrderModel";
import { GenerateId } from "../../services/GenerateId";

export class OrderController {

// Criar pedido
  async postOrder(req: Request, res: Response) {
    let errorstatus = 500;
    try {
      const id = new GenerateId().generateId();

      const { name, folder, size, price,  user_id } = req.body;
      if ( !name|| !folder || !size || !price || !user_id ) {
        errorstatus = 422;
        throw new Error("Digite os parametros necessarios ");
      }
      const newOrder = new Order(
        id,
        name,
        folder,
        size,
        price,
        user_id
      );
      const orderdata = new OrderData();
      const result = await orderdata.createOrder(newOrder);
      console.log(result);
      res.status(202).send({ result: result });
    } catch (error:any) {
      res.status(errorstatus).send(error.message || error.sqlMessage);
    }
  }

// Pegar todos os pedidos do usuário

  async getOrdersByUser(req: Request, res: Response): Promise<void> {
    let errorstatus = 500;
    const id = req.params.id as string;
    try {
        if ( !id) {
          errorstatus = 401;
          throw new Error("O parâmetro id é necessário");
    }
      const order = await new OrderData().getAllOrderByUser(id);
      res.status(200).send({ Result: order });
    } catch (error:any) {
      res.status(errorstatus).send(error.message || error.sqlMessage);
    }
  }

// Deletar pedido

  async deleteOrder(req: Request, res: Response) {
    let errorstatus = 500;
    try {
      const id = req.params.id;
      const result = await new OrderData().deleteOrder(id);
      res.status(200).send({ result: result });
    } catch (error:any) {
      res.status(errorstatus).send(error.message || error.sqlMessage);
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
 *         description: Parâmetro id não informado
 *       500:
 *         description: Erro interno
 */
orderRouter.get('/getorderbyuser/:id', orderController.getOrdersByUser)

/**
 * @swagger
 * /order/postorder:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, folder, size, price, user_id]
 *             properties:
 *               name:
 *                 type: string
 *               folder:
 *                 type: string
 *               size:
 *                 type: string
 *               price:
 *                 type: string
 *               user_id:
 *                 type: string
 *     responses:
 *       202:
 *         description: Pedido criado com sucesso
 *       422:
 *         description: Parâmetros obrigatórios não informados
 *       500:
 *         description: Erro interno
 */
orderRouter.post('/postorder', orderController.postOrder)

/**
 * @swagger
 * /order/deleteorder/{id}:
 *   delete:
 *     summary: Exclui um pedido
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido excluído com sucesso
 *       500:
 *         description: Erro interno
 */
orderRouter.delete('/deleteorder/:id', orderController.deleteOrder)
