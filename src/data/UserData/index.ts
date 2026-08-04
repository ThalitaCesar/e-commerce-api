import { User } from "../../models/UserModel";
import { Users } from "../../types/types";
import { DataBase } from "../DataBase";
import { UserModel } from "../../models/SequelizeModels";
import { AppError } from "../../utils/AppError";

export class UserData extends DataBase {

  async signUpUser(user: User) {
    await UserModel.create({
      id: user.getId(),
      cpf: user.getCpf(),
      data: user.getData(),
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      role: user.getRole(),
    });
  }

  public getProfileByEmail = async (email: string) => {
    const result = await UserModel.findOne({ where: { email } });
    return result?.toJSON() as Users | undefined;
  };

  async getById(id: string) {
    const result = await UserModel.findOne({ where: { id } });
    return result?.toJSON() as Users | undefined;
  }

  async getAllUsers() {
    const users = await UserModel.findAll({ attributes: { exclude: ["password"] } });
    return users.map((user) => user.toJSON()) as Users[];
  }

  async getProfile(id: string) {
    const users = await UserModel.findAll({ attributes: { exclude: ["password"] }, where: { id } });
    return users.map((user) => user.toJSON()) as Users[];
  }

  async getProfileById(id: string) {
    return UserModel.findAll({
      attributes: ["id", "name", "cpf", "data", "email", "role"],
      where: { id },
    });
  }

  async getIdUserByEmail(email: string) {
    return UserModel.findAll({ attributes: ["id"], where: { email } });
  }

  async updateUser(id: string, name: string, cpf: string, data: string, email: string) {
    const result = await UserModel.findOne({ where: { id } });
    if (!result) {
      throw new AppError("Usuário não encontrado", 404);
    }
    await result.update({ name, cpf, data, email });
    return "Alterações realizadas com sucesso";
  }

  async updatePassword(id: string, password: string) {
    const result = await UserModel.findOne({ where: { id } });
    if (!result) {
      throw new AppError("Usuário não encontrado", 404);
    }
    await result.update({ password });
    return "Senha alterada com sucesso";
  }

  async deleteUser(id: string) {
    await UserModel.destroy({ where: { id } });
    return "Conta deletada com sucesso";
  }
}
