import { Op, Transaction } from "sequelize";
import { Promotion } from "../../models/PromotionModel";
import { PromotionModel } from "../../models/SequelizeModels";
import { DataBase } from "../DataBase";
import { AppError } from "../../utils/AppError";

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

export class PromotionData extends DataBase {

  private async assertNoOverlap(startDate: string, endDate: string, excludeId?: string) {
    const overlapping = await PromotionModel.findOne({
      where: {
        active: true,
        start_date: { [Op.lte]: endDate },
        end_date: { [Op.gte]: startDate },
        ...(excludeId ? { id: { [Op.ne]: excludeId } } : {}),
      },
    });
    if (overlapping) {
      throw new AppError("Já existe uma promoção ativa nesse período", 409);
    }
  }

  async createPromotion(promotion: Promotion) {
    if (promotion.getActive()) {
      await this.assertNoOverlap(promotion.getStartDate(), promotion.getEndDate());
    }
    await PromotionModel.create({
      id: promotion.getId(),
      name: promotion.getName(),
      discount_percent: promotion.getDiscountPercent(),
      start_date: promotion.getStartDate(),
      end_date: promotion.getEndDate(),
      active: promotion.getActive(),
    });
    return "Promoção criada com sucesso";
  }

  async getAllPromotions() {
    const result = await PromotionModel.findAll({ order: [["start_date", "DESC"]] });
    return result.map((item) => item.toJSON());
  }

  async getActivePromotion(transaction?: Transaction) {
    const today = todayISODate();
    const result = await PromotionModel.findOne({
      where: {
        active: true,
        start_date: { [Op.lte]: today },
        end_date: { [Op.gte]: today },
      },
      transaction,
    });
    return result;
  }

  async updatePromotion(
    id: string,
    name?: string,
    discountPercent?: number,
    startDate?: string,
    endDate?: string,
    active?: boolean,
  ) {
    const result = await PromotionModel.findOne({ where: { id } });
    if (!result) {
      throw new AppError("Promoção não encontrada", 404);
    }
    const nextStart = startDate ?? result.start_date;
    const nextEnd = endDate ?? result.end_date;
    const nextActive = active ?? result.active;
    if (nextActive) {
      await this.assertNoOverlap(nextStart, nextEnd, id);
    }
    await result.update({
      ...(name !== undefined ? { name } : {}),
      ...(discountPercent !== undefined ? { discount_percent: discountPercent } : {}),
      ...(startDate !== undefined ? { start_date: startDate } : {}),
      ...(endDate !== undefined ? { end_date: endDate } : {}),
      ...(active !== undefined ? { active } : {}),
    });
    return "Promoção alterada com sucesso";
  }

  async deletePromotion(id: string) {
    const result = await PromotionModel.findOne({ where: { id } });
    if (!result) {
      throw new AppError("Promoção não encontrada", 404);
    }
    await result.destroy();
    return "Promoção deletada com sucesso";
  }
}
