import { Images, Product, Size } from "../../models/ProductModel";
import { AllImages, AllProducts, AllSizes } from "../../types/types";
import { DataBase } from "../DataBase";
import { ImageModel, ProductModel, SizeModel } from "../../models/SequelizeModels";
import { Op } from "sequelize";

export class ProductData extends DataBase {

    async createProduct(product: Product) {
      try {
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
      } catch (error:any) {
        return error.message;
      }
    }

    async getAllProducts(page: number, perPage: number, query?: string) {
      try {
        const result = await ProductModel.findAll({
          where: query ? { name: { [Op.like]: `%${query}%` } } : undefined,
          limit: perPage,
          offset: (page - 1) * perPage,
        });
        const totalCount = await ProductModel.count({ where: query ? { name: { [Op.like]: `%${query}%` } } : undefined });
        return { products: result.map((item) => item.toJSON()) as AllProducts[], totalCount };
      } catch (error: any) {
        return error.message;
      }
    }

    async getTotalCountAllProducts(query?: string) {
      try {
        return ProductModel.count({ where: query ? { name: { [Op.like]: `%${query}%` } } : undefined });
      } catch (error: any) {
        return error.message;
      }
    }

    async getProductByCategory(page: number, perPage: number, category: string) {
      try {
        const result = await ProductModel.findAll({
          where: { category },
          limit: perPage,
          offset: (page - 1) * perPage,
        });
        return result.map((item) => item.toJSON()) as AllProducts[];
      } catch (error: any) {
        return error.message;
      }
    }

    async getTotalCountByCategory(category: string) {
      try {
        return ProductModel.count({ where: { category } });
      } catch (error: any) {
        return error.message;
      }
    }

  async getAllProductById(id: string) {
    try {
      return ProductModel.findAll({ where: { id } });
    } catch (error:any) {
      return error.message;
    }
  }

  async updateProduct(id: string, name: string, price: string, description: string, category: string, folder: string) {
    try {
      const result = await ProductModel.findOne({ where: { id } });
      if (!result) {
        throw new Error("Produto não encontrado");
      }
      await result.update({ name, price, description, category, folder });
      return "Produto alterado com sucesso";
    } catch (error:any) {
      return error.message;
    }
  }

  async deleteProduct(id: string) {
    try {
      const result = await ProductModel.findOne({ where: { id } });
      if (!result) {
        throw new Error("Produto não encontrado");
      }
      await result.destroy();
      return "Produto deletado com sucesso";
    } catch (error:any) {
      return error.message;
    }
  }
};

export class ImageData extends DataBase {
    async createImage(images: Images) {
      try {
        await ImageModel.create({
          id: images.getId(),
          photos: images.getPhotos(),
          product_id: images.getProductId(),
        });
        return "Imagem adicionada com sucesso";
      } catch (error:any) {
        return error.message;
      }
    }

  async getAllImagesForProduct(product_id: string) {
    try {
      const result = await ImageModel.findAll({ attributes: ["id", "photos"], where: { product_id } });
      return result.map((item) => item.toJSON()) as AllImages[];
    } catch (error:any) {
      return error.message;
    }
  }

  async deleteImage(id: string) {
    try {
      const result = await ImageModel.findOne({ where: { id } });
      if (!result) {
        throw new Error("Imagem não encontrada");
      }
      await result.destroy();
      return "Imagem deletada com sucesso";
    } catch (error:any) {
      return error.message;
    }
  }
}

export class SizeData extends DataBase {

    async createSize(size: Size) {
      try {
        await SizeModel.create({
          id: size.getId(),
          sizes: size.getSizes(),
          product_id: size.getProductId(),
        });
        return "Tamanho adicionado com sucesso";
      } catch (error:any) {
        return error.message;
      }
    }

  async getAllSizesForProduct(product_id: string) {
    try {
      const result = await SizeModel.findAll({ attributes: ["id", "sizes"], where: { product_id } });
      return result.map((item) => item.toJSON()) as AllSizes[];
    } catch (error:any) {
      return error.message;
    }
  }

  async deleteSize(id: string) {
    try {
      const result = await SizeModel.findOne({ where: { id } });
      if (!result) {
        throw new Error("Tamanho não encontrado");
      }
      await result.destroy();
      return "Tamanho deletado com sucesso";
    } catch (error:any) {
      return error.message;
    }
  }
}