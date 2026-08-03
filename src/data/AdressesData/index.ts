import { Adresses } from "../../models/AdressesModel";
import { GetAllAdresses } from "../../types/types";
import { DataBase } from "../DataBase";
import { AddressModel } from "../../models/SequelizeModels";

export class AdressesData extends DataBase {

  async createAdresses(adresses: Adresses) {
      try {
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
      } catch (error:any) {
        return error.message;
      }
  }

  async getAllAdressesByUser(user_id: string) {
    try {
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
    } catch (error:any) {
      return error.message;
    }
  }

  async updateAdresses(id: string, cep: string, street: string, district: string, city: string, number: number, state: string, complement?: string) {
    try {
      const result = await AddressModel.findOne({ where: { id } });
      if (!result) {
        throw new Error("Endereço não encontrado");
      }
      await result.update({ cep, street, district, city, number: String(number), state, complement });
      return "Endereço alterado com sucesso";
    } catch (error:any) {
      return error.message;
    }
  }

  async deleteAdresses(id: string) {
    try {
      const result = await AddressModel.findOne({ where: { id } });
      if (!result) {
        throw new Error("Endereço não encontrada");
      }
      await result.destroy();
      return "Endereço deletado com sucesso";
    } catch (error:any) {
      return error.message;
    }
  }
}