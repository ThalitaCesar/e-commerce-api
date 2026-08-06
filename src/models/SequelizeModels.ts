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
  weight: number | null;
  height: number | null;
  width: number | null;
  length: number | null;
}

interface ProductCreationAttributes
  extends Optional<ProductAttributes, "id" | "weight" | "height" | "width" | "length"> {}

class ProductModel extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: string;
  public name!: string;
  public price!: string;
  public description!: string;
  public created!: string;
  public category!: string;
  public folder!: string;
  public weight!: number | null;
  public height!: number | null;
  public width!: number | null;
  public length!: number | null;
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
    weight: { type: DataTypes.FLOAT, allowNull: true, comment: "Peso em kg" },
    height: { type: DataTypes.FLOAT, allowNull: true, comment: "Altura em cm" },
    width: { type: DataTypes.FLOAT, allowNull: true, comment: "Largura em cm" },
    length: { type: DataTypes.FLOAT, allowNull: true, comment: "Comprimento em cm" },
  },
  { sequelize, tableName: "Lama_Product", timestamps: false }
);

interface ProductVariationAttributes {
  id: string;
  name: string;
  product_id: string;
}

interface ProductVariationCreationAttributes extends Optional<ProductVariationAttributes, "id"> {}

class ProductVariationModel
  extends Model<ProductVariationAttributes, ProductVariationCreationAttributes>
  implements ProductVariationAttributes
{
  public id!: string;
  public name!: string;
  public product_id!: string;
}

ProductVariationModel.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    product_id: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "Lama_ProductVariation", timestamps: false }
);

interface ImageAttributes {
  id: string;
  photos: string;
  product_id: string;
  variation_id: string | null;
}

interface ImageCreationAttributes extends Optional<ImageAttributes, "id" | "variation_id"> {}

class ImageModel extends Model<ImageAttributes, ImageCreationAttributes> implements ImageAttributes {
  public id!: string;
  public photos!: string;
  public product_id!: string;
  public variation_id!: string | null;
}

ImageModel.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    photos: { type: DataTypes.STRING, allowNull: false },
    product_id: { type: DataTypes.STRING, allowNull: false },
    variation_id: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, tableName: "Lama_Images", timestamps: false }
);

interface VariationSizeAttributes {
  id: string;
  variation_id: string;
  size: string;
  price: string;
  quantity: number;
}

interface VariationSizeCreationAttributes extends Optional<VariationSizeAttributes, "id" | "quantity"> {}

class VariationSizeModel
  extends Model<VariationSizeAttributes, VariationSizeCreationAttributes>
  implements VariationSizeAttributes
{
  public id!: string;
  public variation_id!: string;
  public size!: string;
  public price!: string;
  public quantity!: number;
}

VariationSizeModel.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    variation_id: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { sequelize, tableName: "Lama_VariationSize", timestamps: false }
);

interface OrderAttributes {
  id: string;
  product_id: string;
  variation_size_id: string | null;
  variation_name: string | null;
  name: string;
  folder: string;
  size: string;
  price: string;
  quantity: number;
  user_id: string;
  status: string;
}

interface OrderCreationAttributes
  extends Optional<OrderAttributes, "id" | "status" | "variation_size_id" | "variation_name"> {}

class OrderModel extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: string;
  public product_id!: string;
  public variation_size_id!: string | null;
  public variation_name!: string | null;
  public name!: string;
  public folder!: string;
  public size!: string;
  public price!: string;
  public quantity!: number;
  public user_id!: string;
  public status!: string;
}

OrderModel.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    product_id: { type: DataTypes.STRING, allowNull: false },
    variation_size_id: { type: DataTypes.STRING, allowNull: true },
    variation_name: { type: DataTypes.STRING, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: false },
    folder: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    user_id: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "PENDING_PAYMENT" },
  },
  { sequelize, tableName: "Lama_OrderUser", timestamps: false }
);

interface PaymentAttributes {
  id: string;
  order_id: string;
  user_id: string;
  method: string;
  status: string;
  amount: number;
  external_id: string;
  qr_code?: string;
  qr_code_base64?: string;
  ticket_url?: string;
  created_at: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, "id" | "created_at"> {}

class PaymentModel extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: string;
  public order_id!: string;
  public user_id!: string;
  public method!: string;
  public status!: string;
  public amount!: number;
  public external_id!: string;
  public qr_code?: string;
  public qr_code_base64?: string;
  public ticket_url?: string;
  public created_at!: Date;
}

PaymentModel.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    order_id: { type: DataTypes.STRING, allowNull: false },
    user_id: { type: DataTypes.STRING, allowNull: false },
    method: { type: DataTypes.ENUM("CREDIT_CARD", "DEBIT_CARD", "PIX"), allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    external_id: { type: DataTypes.STRING, allowNull: false },
    qr_code: { type: DataTypes.TEXT, allowNull: true },
    qr_code_base64: { type: DataTypes.TEXT, allowNull: true },
    ticket_url: { type: DataTypes.STRING, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: "Lama_Payment", timestamps: false }
);

interface PromotionAttributes {
  id: string;
  name: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
  active: boolean;
}

interface PromotionCreationAttributes extends Optional<PromotionAttributes, "id" | "active"> {}

class PromotionModel
  extends Model<PromotionAttributes, PromotionCreationAttributes>
  implements PromotionAttributes
{
  public id!: string;
  public name!: string;
  public discount_percent!: number;
  public start_date!: string;
  public end_date!: string;
  public active!: boolean;
}

PromotionModel.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    discount_percent: { type: DataTypes.FLOAT, allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { sequelize, tableName: "Lama_Promotion", timestamps: false }
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

export {
  UserModel,
  ProductModel,
  ImageModel,
  ProductVariationModel,
  VariationSizeModel,
  OrderModel,
  AddressModel,
  PaymentModel,
  PromotionModel,
};
