import { Images, Product, Size } from "../../models/ProductModel";
import { AllImages, AllProducts, AllSizes } from "../../types/types";
import { DataBase } from "../DataBase";
import { ImageModel, ProductModel, SizeModel } from "../../models/SequelizeModels";
import { Op } from "sequelize";
import { AppError } from "../../utils/AppError";

export class ProductData extends DataBase {

    async createProduct(product: Product) {
      await ProductModel.create({
        id: product.getId(),
        name: product.getName(),
        price: product.getPrice(),
        description: product.getDescription(),
        created: product.getCreated(),
        category: product.getCategory(),
        folder: product.getFolder(),
      });
      return "Produto criado com sucesso";
    }

    async getAllProducts(page: number, perPage: number, query?: string) {
      const result = await ProductModel.findAll({
        where: query ? { name: { [Op.like]: `%${query}%` } } : undefined,
        limit: perPage,
        offset: (page - 1) * perPage,
      });
      const totalCount = await ProductModel.count({ where: query ? { name: { [Op.like]: `%${query}%` } } : undefined });
      return { products: result.map((item) => item.toJSON()) as AllProducts[], totalCount };
    }

    async getTotalCountAllProducts(query?: string) {
      return ProductModel.count({ where: query ? { name: { [Op.like]: `%${query}%` } } : undefined });
    }

    async getProductByCategory(page: number, perPage: number, category: string) {
      const result = await ProductModel.findAll({
        where: { category },
        limit: perPage,
        offset: (page - 1) * perPage,
      });
      return result.map((item) => item.toJSON()) as AllProducts[];
    }

    async getTotalCountByCategory(category: string) {
      return ProductModel.count({ where: { category } });
    }

  async getAllProductById(id: string) {
    return ProductModel.findAll({ where: { id } });
  }

  async updateProduct(id: string, name: string, price: string, description: string, category: string, folder: string) {
    const result = await ProductModel.findOne({ where: { id } });
    if (!result) {
      throw new AppError("Produto não encontrado", 404);
    }
    await result.update({ name, price, description, category, folder });
    return "Produto alterado com sucesso";
  }

  async deleteProduct(id: string) {
    const result = await ProductModel.findOne({ where: { id } });
    if (!result) {
      throw new AppError("Produto não encontrado", 404);
    }
    await result.destroy();
    return "Produto deletado com sucesso";
  }
};

export class ImageData extends DataBase {
    async createImage(images: Images) {
      await ImageModel.create({
        id: images.getId(),
        photos: images.getPhotos(),
        product_id: images.getProductId(),
      });
      return "Imagem adicionada com sucesso";
    }

  async getAllImagesForProduct(product_id: string) {
    const result = await ImageModel.findAll({ attributes: ["id", "photos"], where: { product_id } });
    return result.map((item) => item.toJSON()) as AllImages[];
  }

  async deleteImage(id: string) {
    const result = await ImageModel.findOne({ where: { id } });
    if (!result) {
      throw new AppError("Imagem não encontrada", 404);
    }
    await result.destroy();
    return "Imagem deletada com sucesso";
  }
}

export class SizeData extends DataBase {

    async createSize(size: Size) {
      await SizeModel.create({
        id: size.getId(),
        sizes: size.getSizes(),
        product_id: size.getProductId(),
      });
      return "Tamanho adicionado com sucesso";
    }

  async getAllSizesForProduct(product_id: string) {
    const result = await SizeModel.findAll({ attributes: ["id", "sizes"], where: { product_id } });
    return result.map((item) => item.toJSON()) as AllSizes[];
  }

  async deleteSize(id: string) {
    const result = await SizeModel.findOne({ where: { id } });
    if (!result) {
      throw new AppError("Tamanho não encontrado", 404);
    }
    await result.destroy();
    return "Tamanho deletado com sucesso";
  }
}
