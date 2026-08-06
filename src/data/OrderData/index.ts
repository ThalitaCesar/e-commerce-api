import { Order } from "../../models/OrderModel";
import { AllOrderByUser } from "../../types/types";
import { DataBase } from "../DataBase";
import { OrderModel, ProductModel, ProductVariationModel, VariationSizeModel } from "../../models/SequelizeModels";
import { AppError } from "../../utils/AppError";
import { applyDiscountToPrice } from "../../utils/price";
import { PromotionData } from "../PromotionData";

export class OrderData extends DataBase {

  async createOrder(order: Order) {
    const sequelize = this.getConnection();
    return sequelize.transaction(async (t) => {
      const product = await ProductModel.findOne({ where: { id: order.getProductId() }, transaction: t });
      if (!product) {
        throw new AppError("Produto não encontrado", 404);
      }

      const hasVariations =
        (await ProductVariationModel.count({ where: { product_id: product.id }, transaction: t })) > 0;

      let size = "";
      let price = product.price;
      let variationName: string | null = null;
      let variationSizeId: string | null = null;

      if (hasVariations) {
        const requestedVariationSizeId = order.getVariationSizeId();
        if (!requestedVariationSizeId) {
          throw new AppError("Selecione uma variação e tamanho para este produto", 422);
        }
        const variationSize = await VariationSizeModel.findOne({
          where: { id: requestedVariationSizeId },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (!variationSize) {
          throw new AppError("Variação/tamanho não encontrado", 404);
        }
        const variation = await ProductVariationModel.findOne({
          where: { id: variationSize.variation_id, product_id: product.id },
          transaction: t,
        });
        if (!variation) {
          throw new AppError("Variação não pertence a este produto", 422);
        }
        if (variationSize.quantity < order.getQuantity()) {
          throw new AppError("Estoque insuficiente para esta variação/tamanho", 409);
        }
        await variationSize.update({ quantity: variationSize.quantity - order.getQuantity() }, { transaction: t });
        size = variationSize.size;
        price = variationSize.price;
        variationName = variation.name;
        variationSizeId = variationSize.id;
      }

      const activePromotion = await new PromotionData().getActivePromotion(t);
      if (activePromotion) {
        price = applyDiscountToPrice(price, activePromotion.discount_percent);
      }

      await OrderModel.create(
        {
          id: order.getId(),
          product_id: product.id,
          variation_size_id: variationSizeId,
          variation_name: variationName,
          name: product.name,
          folder: product.folder,
          size,
          price,
          quantity: order.getQuantity(),
          user_id: order.getUserId(),
        },
        { transaction: t }
      );
      return "Pedido criado com sucesso";
    });
  }

  async getAllOrderByUser(userId: string) {
    const result = await OrderModel.findAll({ where: { user_id: userId } });
    return result.map((item) => {
      const data = item.toJSON();
      return {
        id: data.id,
        productId: data.product_id,
        variationSizeId: data.variation_size_id,
        variationName: data.variation_name,
        name: data.name,
        folder: data.folder,
        size: data.size,
        price: data.price,
        quantity: data.quantity,
        userId: data.user_id,
        status: data.status,
      } as AllOrderByUser;
    });
  }

  async getOrderById(id: string) {
    const result = await OrderModel.findOne({ where: { id } });
    return result?.toJSON() as
      | { id: string; name: string; price: string; user_id: string; status: string }
      | undefined;
  }

  async updateStatus(id: string, status: string) {
    const result = await OrderModel.findOne({ where: { id } });
    if (!result) {
      throw new AppError("Pedido não encontrado", 404);
    }
    await result.update({ status });
    return "Status do pedido atualizado com sucesso";
  }

  async deleteOrder(id: string) {
    const result = await OrderModel.findOne({ where: { id } });
    if (!result) {
      throw new AppError("Pedido não encontrado", 404);
    }
    await result.destroy();
    return "Pedido deletado com sucesso";
  }
};
