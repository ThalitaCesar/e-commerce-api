import express from "express";
import { NextFunction, Request, Response } from "express";
import { ImageData, ProductData, VariationData, VariationSizeData } from "../../data/ProductData";
import { CATEGORIES, Images, Product, Variation, VariationSize } from "../../models/ProductModel";
import { GenerateId } from "../../services/GenerateId";
import { AppError } from "../../utils/AppError";
import { authenticate, requireAdmin } from "../../middlewares/authMiddleware";
import {
  createProductSchema,
  createVariationSchema,
  createVariationSizeSchema,
  updateProductSchema,
  updateVariationSizeSchema,
} from "../../validators/productValidator";

export class ProductController {

// Criar produto
  async postProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = new GenerateId().generateId();
      const validated = createProductSchema.parse(req.body);
      const newProduct = new Product(
        id,
        validated.name,
        validated.description,
        validated.price,
        validated.created,
        validated.category as CATEGORIES,
        validated.folder,
      );
      const productdata = new ProductData();
      const result = await productdata.createProduct(newProduct);
      res.status(202).send({ result: result });
    } catch (error) {
      next(error);
    }
  }

// Pegar todos os produtos

async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 8;
    const query = req.query.query as string | undefined;
    const { products, totalCount } = await new ProductData().getAllProducts(page, perPage, query);
    res.status(200).send({ Result: products, TotalCount: totalCount });
  } catch (error) {
    next(error);
  }
}

//pegar produtos por categoria

async getProductByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 8;
    const category = req.params.category as string;
    const productData = new ProductData();
    const products = await productData.getProductByCategory(page, perPage, category);
    const totalCount = await productData.getTotalCountByCategory(category);
    res.status(200).send({ Result: products, TotalCount: totalCount });
  } catch (error) {
    next(error);
  }
}

//  Pegar produtos por id

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const product = await new ProductData().getAllProductById(id);
      res.status(200).send({ Result: product });
    } catch (error) {
      next(error);
    }
  }

//  Pegar produto com imagens principais, variações, imagens e tamanhos/estoque de cada variação

  async getProductFullDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await new ProductData().getProductFullDetails(id);
      res.status(200).send({ Result: result });
    } catch (error) {
      next(error);
    }
  }

//  Editar produto

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = updateProductSchema.parse(req.body);
      const result = await new ProductData().updateProduct(
            validated.id,
            validated.name as string,
            validated.price as string,
            validated.description as string,
            validated.category as string,
            validated.folder as string
      );
      res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  }

// Deletar produto

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await new ProductData().deleteProduct(id);
      res.status(200).send({ result: result });
    } catch (error) {
      next(error);
    }
  }

  //  Postar imagens principais do produto (ou de uma variação, se variationId for informado)

  async postImage(req: Request, res: Response, next: NextFunction) {
    try {
      const id = new GenerateId().generateId();
      const product_id = req.params.id;
      const { photos, variationId } = req.body;
      if (!photos) {
        throw new AppError("Digite os parametros necessarios", 422);
      }
      const newImage = new Images(
        id,
        photos,
        product_id,
        variationId,
      );
      const imagemdata = new ImageData();
      const result = await imagemdata.createImage(newImage);
      res.status(202).send({ result: result });
    } catch (error) {
      next(error);
    }
  }

    //  Pegar imagens principais do produto

  async getImagesByProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product_id = req.params.id;
      const result = await new ImageData().getAllImagesForProduct(product_id);
      res.status(200).send({ Result: result });
    } catch (error) {
      next(error);
    }
  }

  //  Pegar imagens de uma variação

  async getImagesByVariation(req: Request, res: Response, next: NextFunction) {
    try {
      const variation_id = req.params.id;
      const result = await new ImageData().getAllImagesForVariation(variation_id);
      res.status(200).send({ Result: result });
    } catch (error) {
      next(error);
    }
  }

   //  Deletar imagens do produto

  async deleteImages(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await new ImageData().deleteImage(id);
      res.status(200).send({ result: result });
    } catch (error) {
      next(error);
    }
  }

  //  Postar variação do produto (ex: cor, estampa, tamanho único de perfume)

  async postVariation(req: Request, res: Response, next: NextFunction) {
    try {
      const id = new GenerateId().generateId();
      const product_id = req.params.id;
      const validated = createVariationSchema.parse(req.body);
      const newVariation = new Variation(
        id,
        validated.name,
        product_id,
      );
      const variationData = new VariationData();
      const result = await variationData.createVariation(newVariation);
      res.status(202).send({ result: result });
    } catch (error) {
      next(error);
    }
  }

  //  Pegar variações do produto

  async getVariationsByProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product_id = req.params.id;
      const result = await new VariationData().getAllVariationsForProduct(product_id);
      res.status(200).send({ Result: result });
    } catch (error) {
      next(error);
    }
  }

  //  Deletar variação do produto

  async deleteVariation(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await new VariationData().deleteVariation(id);
      res.status(200).send({ result: result });
    } catch (error) {
      next(error);
    }
  }

  //  Postar tamanho + preço + estoque de uma variação

  async postVariationSize(req: Request, res: Response, next: NextFunction) {
    try {
      const id = new GenerateId().generateId();
      const variation_id = req.params.id;
      const validated = createVariationSizeSchema.parse(req.body);
      const newVariationSize = new VariationSize(
        id,
        variation_id,
        validated.size,
        validated.price,
        validated.quantity,
      );
      const variationSizeData = new VariationSizeData();
      const result = await variationSizeData.createVariationSize(newVariationSize);
      res.status(202).send({ result: result });
    } catch (error) {
      next(error);
    }
  }

  //  Pegar tamanhos/estoque de uma variação

  async getSizesByVariation(req: Request, res: Response, next: NextFunction) {
    try {
      const variation_id = req.params.id;
      const result = await new VariationSizeData().getAllSizesForVariation(variation_id);
      res.status(200).send({ Result: result });
    } catch (error) {
      next(error);
    }
  }

  //  Atualizar tamanho/preço/estoque

  async updateVariationSize(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const validated = updateVariationSizeSchema.parse(req.body);
      const result = await new VariationSizeData().updateVariationSize(
        id,
        validated.size,
        validated.price,
        validated.quantity,
      );
      res.status(201).send({ result: result });
    } catch (error) {
      next(error);
    }
  }

  //  Deletar tamanho/estoque de uma variação

  async deleteVariationSize(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await new VariationSizeData().deleteVariationSize(id);
      res.status(200).send({ result: result });
    } catch (error) {
      next(error);
    }
  }
}

// Rotas

export const productRouter = express.Router()

const productController = new ProductController()

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Produtos, imagens, variações e tamanhos/estoque
 */

/**
 * @swagger
 * /product/getproducts:
 *   get:
 *     summary: Lista produtos paginados, com busca opcional
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 8
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Termo de busca pelo nome do produto
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 TotalCount:
 *                   type: integer
 *       500:
 *         description: Erro interno
 */
productRouter.get('/getproducts', productController.getAllProducts);

/**
 * @swagger
 * /product/getproducts/{category}:
 *   get:
 *     summary: Lista produtos paginados por categoria
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [FEM, MASC, SPORT, BA, FOOTWEAR]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 8
 *     responses:
 *       200:
 *         description: Lista de produtos da categoria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 TotalCount:
 *                   type: integer
 *       500:
 *         description: Erro interno
 */
productRouter.get('/getproducts/:category', productController.getProductByCategory);

/**
 * @swagger
 * /product/product/{id}:
 *   get:
 *     summary: Busca um produto pelo id
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Result:
 *                   $ref: '#/components/schemas/Product'
 *       500:
 *         description: Erro interno
 */
productRouter.get('/product/:id', productController.getProductById)

/**
 * @swagger
 * /product/getfulldetails/{id}:
 *   get:
 *     summary: Busca um produto com imagens principais, variações (cor/estampa/tamanho) e, para cada variação, suas imagens e tamanhos com preço e estoque
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto com detalhes completos
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno
 */
productRouter.get('/getfulldetails/:id', productController.getProductFullDetails)

/**
 * @swagger
 * /product/getAllImagesByProduct/{id}:
 *   get:
 *     summary: Lista as imagens principais de um produto
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de imagens
 *       500:
 *         description: Erro interno
 */
productRouter.get('/getAllImagesByProduct/:id', productController.getImagesByProduct)

/**
 * @swagger
 * /product/getimagesbyvariation/{id}:
 *   get:
 *     summary: Lista as imagens de uma variação
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id da variação
 *     responses:
 *       200:
 *         description: Lista de imagens
 *       500:
 *         description: Erro interno
 */
productRouter.get('/getimagesbyvariation/:id', productController.getImagesByVariation)

/**
 * @swagger
 * /product/getvariationsbyproduct/{id}:
 *   get:
 *     summary: Lista as variações (cor/estampa/tamanho) de um produto
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de variações
 *       500:
 *         description: Erro interno
 */
productRouter.get('/getvariationsbyproduct/:id', productController.getVariationsByProduct)

/**
 * @swagger
 * /product/getsizesbyvariation/{id}:
 *   get:
 *     summary: Lista os tamanhos (com preço e estoque) de uma variação
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id da variação
 *     responses:
 *       200:
 *         description: Lista de tamanhos
 *       500:
 *         description: Erro interno
 */
productRouter.get('/getsizesbyvariation/:id', productController.getSizesByVariation)

/**
 * @swagger
 * /product/postproduct:
 *   post:
 *     summary: Cria um novo produto (admin)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price, created, category, folder]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: string
 *               created:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [FEM, MASC, SPORT, BA, FOOTWEAR]
 *               folder:
 *                 type: string
 *     responses:
 *       202:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       500:
 *         description: Erro interno
 */
productRouter.post('/postproduct', authenticate, requireAdmin, productController.postProduct)

/**
 * @swagger
 * /product/postimage/{id}:
 *   post:
 *     summary: Adiciona uma imagem principal a um produto, ou a uma variação se variationId for informado (admin)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [photos]
 *             properties:
 *               photos:
 *                 type: string
 *               variationId:
 *                 type: string
 *                 description: Se informado, a imagem é associada a essa variação em vez de ser uma imagem principal do produto
 *     responses:
 *       202:
 *         description: Imagem criada com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       422:
 *         description: Parâmetros obrigatórios não informados
 *       500:
 *         description: Erro interno
 */
productRouter.post('/postimage/:id', authenticate, requireAdmin, productController.postImage)

/**
 * @swagger
 * /product/postvariation/{id}:
 *   post:
 *     summary: Adiciona uma variação (cor, estampa, tamanho de perfume etc.) a um produto (admin)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       202:
 *         description: Variação criada com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro interno
 */
productRouter.post('/postvariation/:id', authenticate, requireAdmin, productController.postVariation)

/**
 * @swagger
 * /product/postvariationsize/{id}:
 *   post:
 *     summary: Adiciona um tamanho, com preço e estoque, a uma variação (admin)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id da variação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [size, price]
 *             properties:
 *               size:
 *                 type: string
 *               price:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 default: 0
 *                 description: Quantidade em estoque
 *     responses:
 *       202:
 *         description: Tamanho criado com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro interno
 */
productRouter.post('/postvariationsize/:id', authenticate, requireAdmin, productController.postVariationSize)

/**
 * @swagger
 * /product/updateproduct:
 *   put:
 *     summary: Atualiza um produto (admin)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [FEM, MASC, SPORT, BA, FOOTWEAR]
 *               folder:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       500:
 *         description: Erro interno
 */
productRouter.put('/updateproduct', authenticate, requireAdmin, productController.updateProduct)

/**
 * @swagger
 * /product/updatevariationsize/{id}:
 *   put:
 *     summary: Atualiza tamanho, preço e/ou estoque de uma variação (admin)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               size:
 *                 type: string
 *               price:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tamanho atualizado com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       404:
 *         description: Tamanho não encontrado
 *       500:
 *         description: Erro interno
 */
productRouter.put('/updatevariationsize/:id', authenticate, requireAdmin, productController.updateVariationSize)

/**
 * @swagger
 * /product/deleteproduct/{id}:
 *   delete:
 *     summary: Exclui um produto (admin)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto excluído com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       500:
 *         description: Erro interno
 */
productRouter.delete('/deleteproduct/:id', authenticate, requireAdmin, productController.deleteProduct)

/**
 * @swagger
 * /product/deleteimage/{id}:
 *   delete:
 *     summary: Exclui uma imagem (admin)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Imagem excluída com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       500:
 *         description: Erro interno
 */
productRouter.delete('/deleteimage/:id', authenticate, requireAdmin, productController.deleteImages)

/**
 * @swagger
 * /product/deletevariation/{id}:
 *   delete:
 *     summary: Exclui uma variação (admin)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Variação excluída com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       500:
 *         description: Erro interno
 */
productRouter.delete('/deletevariation/:id', authenticate, requireAdmin, productController.deleteVariation)

/**
 * @swagger
 * /product/deletevariationsize/{id}:
 *   delete:
 *     summary: Exclui um tamanho/estoque de uma variação (admin)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tamanho excluído com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       403:
 *         description: Acesso restrito a administradores
 *       500:
 *         description: Erro interno
 */
productRouter.delete('/deletevariationsize/:id', authenticate, requireAdmin, productController.deleteVariationSize)
