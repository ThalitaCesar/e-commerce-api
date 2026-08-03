import { Order } from "../../models/OrderModel";
import { AllOrderByUser } from "../../types/types";
import { DataBase } from "../DataBase";
import { OrderModel } from "../../models/SequelizeModels";

export class OrderData extends DataBase {

    async createOrder(product: Order) {
      try {
        await OrderModel.create({
          id: product.getId(),
          name: product.getName(),
          folder: product.getFolder(),
          size: product.getSize(),
          price: product.getPrice(),
          user_id: product.getUserId(),
        });
        return "Pedido criado com sucesso";
      } catch (error:any) {
        return error.message;
      }
    }

  async getAllOrderByUser(userId: string) {
    try {
      const result = await OrderModel.findAll({ where: { user_id: userId } });
      return result.map((item) => {
        const data = item.toJSON() as { id: string; name: string; folder: string; size: string; price: string; user_id: string };
        return {
          id: data.id,
          name: data.name,
          folder: data.folder,
          size: data.size,
          price: data.price,
          userId: data.user_id,
        } as AllOrderByUser;
      });
    } catch (error:any) {
      return error.message;
    }
  }

  async deleteOrder(id: string) {
    try {
      const result = await OrderModel.findOne({ where: { id } });
      if (!result) {
        throw new Error("Pedido não encontrado");
      }
      await result.destroy();
      return "Pedido deletado com sucesso";
    } catch (error:any) {
      return error.message;
    }
  }
};
