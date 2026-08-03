import { sequelize } from "../database";

export class DataBase {
  protected getConnection() {
    return sequelize;
  }
}