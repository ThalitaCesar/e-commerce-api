import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

interface UserAttributes {
  id: string;
  name: string;
  cpf?: string;
  data?: string;
  email: string;
  password: string;
  role: "NORMAL" | "ADMIN";
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public cpf!: string;
  public data!: string;
  public email!: string;
  public password!: string;
  public role!: "NORMAL" | "ADMIN";
}

UserModel.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    cpf: { type: DataTypes.STRING, allowNull: true },
    data: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("NORMAL", "ADMIN"), allowNull: false, defaultValue: "NORMAL" },
  },
  { sequelize, tableName: "Lama_User", timestamps: false }
);

interface ProductAttributes {
  id: string;
  name: string;
  price: string;
  description: string;
  created: string;
  category: string;
  folder: string;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}

class ProductModel extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: string;
  public name!: string;
  public price!: string;
  public description!: string;
  public created!: string;
  public category!: string;
  public folder!: string;
}

ProductModel.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    created: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    folder: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "Lama_Product", timestamps: false }
);

interface ImageAttributes {
  id: string;
  photos: string;
  product_id: string;
}

interface ImageCreationAttributes extends Optional<ImageAttributes, "id"> {}

class ImageModel extends Model<ImageAttributes, ImageCreationAttributes> implements ImageAttributes {
  public id!: string;
  public photos!: string;
  public product_id!: string;
}

ImageModel.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    photos: { type: DataTypes.STRING, allowNull: false },
    product_id: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "Lama_Images", timestamps: false }
);

interface SizeAttributes {
  id: string;
  sizes: string;
  product_id: string;
}

interface SizeCreationAttributes extends Optional<SizeAttributes, "id"> {}

class SizeModel extends Model<SizeAttributes, SizeCreationAttributes> implements SizeAttributes {
  public id!: string;
  public sizes!: string;
  public product_id!: string;
}

SizeModel.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    sizes: { type: DataTypes.STRING, allowNull: false },
    product_id: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "Lama_Size", timestamps: false }
);

interface OrderAttributes {
  id: string;
  name: string;
  folder: string;
  size: string;
  price: string;
  user_id: string;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {}

class OrderModel extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: string;
  public name!: string;
  public folder!: string;
  public size!: string;
  public price!: string;
  public user_id!: string;
}

OrderModel.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    folder: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.STRING, allowNull: false },
    user_id: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "Lama_OrderUser", timestamps: false }
);

interface AddressAttributes {
  id: string;
  cep: string;
  street: string;
  district: string;
  city: string;
  state: string;
  complement?: string;
  number: string;
  user_id: string;
}

interface AddressCreationAttributes extends Optional<AddressAttributes, "id"> {}

class AddressModel extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  public id!: string;
  public cep!: string;
  public street!: string;
  public district!: string;
  public city!: string;
  public state!: string;
  public complement?: string;
  public number!: string;
  public user_id!: string;
}

AddressModel.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    cep: { type: DataTypes.STRING, allowNull: false },
    street: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    complement: { type: DataTypes.STRING, allowNull: true },
    number: { type: DataTypes.STRING, allowNull: false },
    user_id: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "Lama_Addresses", timestamps: false }
);

export { UserModel, ProductModel, ImageModel, SizeModel, OrderModel, AddressModel };
