import { User } from "../../models/UserModel";
import { Autheticator } from "../../services/Authenticator";
import { Users } from "../../types/types";
import { DataBase } from "../DataBase";
import { UserModel } from "../../models/SequelizeModels";

export class UserData extends DataBase {

  async signUpUser(user: User) {
    try {
      await UserModel.create({
        id: user.getId(),
        cpf: user.getCpf(),
        data: user.getData(),
        name: user.getName(),
        email: user.getEmail(),
        password: user.getPassword(),
        role: user.getRole(),
      });
      const newtoken = new Autheticator();
      const token = newtoken.generateToken(user.getId());
      return token;
    } catch (error:any) {
      return error.message;
    }
  }

  async loginUser(email: string) {
    try {
      return UserModel.findAll({ where: { email } });
    } catch (error:any) {
      return error.message;
    }
  }

  async getAllUsers() {
    try {
      const users = await UserModel.findAll();
      return users.map((user) => user.toJSON()) as Users[];
    } catch (error:any) {
      return error.message;
    }
  }

  async getProfile(id: string) {
    try {
      const users = await UserModel.findAll({ where: { id } });
      return users.map((user) => user.toJSON()) as Users[];
    } catch (error:any) {
      return error.message;
    }
  }

  async getProfileById(id: string) {
    try {
      return UserModel.findAll({
        attributes: ["id", "name", "cpf", "data", "email", "role"],
        where: { id },
      });
    } catch (error:any) {
      return error.message;
    }
  }

  async getIdUserByEmail(email: string) {
    try {
      return UserModel.findAll({ attributes: ["id"], where: { email } });
    } catch (error:any) {
      return error.message;
    }
  }

  public getProfileByEmail = async (email: string) => {
    try {
      const result = await UserModel.findOne({ where: { email } });
      return result?.toJSON();
    } catch (error:any) {
      return error.message;
    }
  };

  async updateUser(id: string, name: string, cpf: string, data: string, email: string) {
    try {
      const result = await UserModel.findOne({ where: { id } });
      if (!result) {
        throw new Error("Usuário não encontrado");
      }
      await result.update({ name, cpf, data, email });
      return "Alterações realizadas com sucesso";
    } catch (error:any) {
      return error.message;
    }
  }

  async updatePassword(id: string, password: string) {
    try {
      const result = await UserModel.findOne({ where: { id } });
      if (!result) {
        throw new Error("Usuário não encontrado");
      }
      await result.update({ password });
      return "Senha alterada com sucesso";
    } catch (error:any) {
      return error.message;
    }
  }

  async deleteUser(token: string) {
    try {
      await UserModel.destroy({ where: { id: token } });
      return "Conta deletada com sucesso";
    } catch (error:any) {
      return error.message;
    }
  }
}