import { Images, Product, Variation, VariationSize } from "../../models/ProductModel";
import { AllImages, AllProducts, AllVariationSizes, AllVariations } from "../../types/types";
import { DataBase } from "../DataBase";
import { ImageModel, ProductModel, ProductVariationModel, VariationSizeModel } from "../../models/SequelizeModels";
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

  async getProductFullDetails(id: string) {
    const product = await ProductModel.findOne({ where: { id } });
    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }
    const mainImages = await ImageModel.findAll({
      attributes: ["id", "photos"],
      where: { product_id: id, variation_id: null },
    });
    const variations = await ProductVariationModel.findAll({ where: { product_id: id } });
    const variationsWithDetails = await Promise.all(
      variations.map(async (variation) => {
        const images = await ImageModel.findAll({
          attributes: ["id", "photos"],
          where: { variation_id: variation.id },
        });
        const sizes = await VariationSizeModel.findAll({ where: { variation_id: variation.id } });
        return {
          id: variation.id,
          name: variation.name,
          images: images.map((item) => item.toJSON()),
          sizes: sizes.map((item) => item.toJSON()),
        };
      })
    );
    return {
      ...product.toJSON(),
      images: mainImages.map((item) => item.toJSON()),
      variations: variationsWithDetails,
    };
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
        variation_id: images.getVariationId() ?? null,
      });
      return "Imagem adicionada com sucesso";
    }

  async getAllImagesForProduct(product_id: string) {
    const result = await ImageModel.findAll({ attributes: ["id", "photos"], where: { product_id, variation_id: null } });
    return result.map((item) => item.toJSON()) as AllImages[];
  }

  async getAllImagesForVariation(variation_id: string) {
    const result = await ImageModel.findAll({ attributes: ["id", "photos"], where: { variation_id } });
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

export class VariationData extends DataBase {

  async createVariation(variation: Variation) {
    await ProductVariationModel.create({
      id: variation.getId(),
      name: variation.getName(),
      product_id: variation.getProductId(),
    });
    return "Variação criada com sucesso";
  }

  async getAllVariationsForProduct(product_id: string) {
    const result = await ProductVariationModel.findAll({ where: { product_id } });
    return result.map((item) => item.toJSON()) as AllVariations[];
  }

  async deleteVariation(id: string) {
    const result = await ProductVariationModel.findOne({ where: { id } });
    if (!result) {
      throw new AppError("Variação não encontrada", 404);
    }
    await result.destroy();
    return "Variação deletada com sucesso";
  }
}

export class VariationSizeData extends DataBase {

  async createVariationSize(variationSize: VariationSize) {
    await VariationSizeModel.create({
      id: variationSize.getId(),
      variation_id: variationSize.getVariationId(),
      size: variationSize.getSize(),
      price: variationSize.getPrice(),
      quantity: variationSize.getQuantity(),
    });
    return "Tamanho adicionado com sucesso";
  }

  async getAllSizesForVariation(variation_id: string) {
    const result = await VariationSizeModel.findAll({ where: { variation_id } });
    return result.map((item) => item.toJSON()) as AllVariationSizes[];
  }

  async updateVariationSize(id: string, size?: string, price?: string, quantity?: number) {
    const result = await VariationSizeModel.findOne({ where: { id } });
    if (!result) {
      throw new AppError("Tamanho não encontrado", 404);
    }
    await result.update({
      ...(size !== undefined ? { size } : {}),
      ...(price !== undefined ? { price } : {}),
      ...(quantity !== undefined ? { quantity } : {}),
    });
    return "Tamanho alterado com sucesso";
  }

  async deleteVariationSize(id: string) {
    const result = await VariationSizeModel.findOne({ where: { id } });
    if (!result) {
      throw new AppError("Tamanho não encontrado", 404);
    }
    await result.destroy();
    return "Tamanho deletado com sucesso";
  }
}
