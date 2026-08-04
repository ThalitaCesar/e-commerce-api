import { Adresses } from "../../models/AdressesModel";
import { GetAllAdresses } from "../../types/types";
import { DataBase } from "../DataBase";
import { AddressModel } from "../../models/SequelizeModels";
import { AppError } from "../../utils/AppError";

export class AdressesData extends DataBase {

  async createAdresses(adresses: Adresses) {
    await AddressModel.create({
      id: adresses.getId(),
      cep: adresses.getCep(),
      street: adresses.getStreet(),
      district: adresses.getDistrict(),
      number: adresses.getNumber(),
      city: adresses.getCity(),
      state: adresses.getState(),
      complement: adresses.getComplement(),
      user_id: adresses.getUserId(),
    });
    return "Endereço adicionado com sucesso";
  }

  async getAllAdressesByUser(user_id: string) {
    const result = await AddressModel.findAll({ where: { user_id } });
    return result.map((item) => {
      const data = item.toJSON() as any;
      return {
        id: data.id,
        cep: data.cep,
        street: data.street,
        city: data.city,
        complement: data.complement,
        number: data.number,
        state: data.state,
        user_id: data.user_id,
      } as GetAllAdresses;
    });
  }

  async getAdressesById(id: string) {
    const result = await AddressModel.findOne({ where: { id } });
    return result?.toJSON() as { id: string; user_id: string } | undefined;
  }

  async updateAdresses(id: string, cep: string, street: string, district: string, city: string, number: string, state: string, complement?: string) {
    const result = await AddressModel.findOne({ where: { id } });
    if (!result) {
      throw new AppError("Endereço não encontrado", 404);
    }
    await result.update({ cep, street, district, city, number, state, complement });
    return "Endereço alterado com sucesso";
  }

  async deleteAdresses(id: string) {
    const result = await AddressModel.findOne({ where: { id } });
    if (!result) {
      throw new AppError("Endereço não encontrado", 404);
    }
    await result.destroy();
    return "Endereço deletado com sucesso";
  }
}
