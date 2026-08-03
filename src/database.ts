import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isSupabaseConfigured = Boolean(process.env.DATABASE_URL);
const sslEnabled = process.env.DB_SSL === "true" || process.env.DB_SSL === "1";

const sequelizeConfig = isSupabaseConfigured
  ? {
      dialect: "postgres" as const,
      url: process.env.DATABASE_URL,
      logging: false,
      ...(sslEnabled
        ? {
            dialectOptions: {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            },
          }
        : {}),
    }
  : {
      dialect: "postgres" as const,
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || "postgres",
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      logging: false,
      ...(sslEnabled
        ? {
            dialectOptions: {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            },
          }
        : {}),
    };

export const sequelize = new Sequelize(sequelizeConfig);

export const connectDatabase = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
};
