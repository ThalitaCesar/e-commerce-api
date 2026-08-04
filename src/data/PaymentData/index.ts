import { Op } from "sequelize";
import { PaymentModel } from "../../models/SequelizeModels";
import { DataBase } from "../DataBase";
import { AppError } from "../../utils/AppError";

export type PaymentAttrs = {
  id: string;
  order_id: string;
  user_id: string;
  method: "CREDIT_CARD" | "DEBIT_CARD" | "PIX";
  status: string;
  amount: number;
  external_id: string;
  qr_code?: string;
  qr_code_base64?: string;
  ticket_url?: string;
};

const ACTIVE_STATUSES = ["pending", "in_process", "approved", "authorized"];

export class PaymentData extends DataBase {

  async createPayment(payment: PaymentAttrs) {
    await PaymentModel.create(payment);
    return payment;
  }

  async getById(id: string) {
    const result = await PaymentModel.findOne({ where: { id } });
    return result?.toJSON();
  }

  async getByExternalId(externalId: string) {
    const result = await PaymentModel.findOne({ where: { external_id: externalId } });
    return result?.toJSON();
  }

  async getByOrderId(orderId: string) {
    const results = await PaymentModel.findAll({ where: { order_id: orderId } });
    return results.map((item) => item.toJSON());
  }

  async getActivePaymentByOrder(orderId: string) {
    const result = await PaymentModel.findOne({
      where: { order_id: orderId, status: { [Op.in]: ACTIVE_STATUSES } },
    });
    return result?.toJSON();
  }

  async updateStatus(id: string, status: string) {
    const result = await PaymentModel.findOne({ where: { id } });
    if (!result) {
      throw new AppError("Pagamento não encontrado", 404);
    }
    await result.update({ status });
    return "Status do pagamento atualizado com sucesso";
  }
}
