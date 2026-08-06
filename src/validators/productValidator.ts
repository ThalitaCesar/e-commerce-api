import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Digite um nome"),
  description: z.string().trim().min(1, "Digite uma descrição"),
  price: z.string().trim().min(1, "Digite um preço"),
  created: z.string().trim().min(1, "Digite a data de criação"),
  category: z.enum(["FEM", "MASC", "SPORT", "BA", "FOOTWEAR"]),
  folder: z.string().trim().min(1, "Digite a pasta"),
  weight: z.number().positive("Digite o peso em kg"),
  height: z.number().positive("Digite a altura em cm"),
  width: z.number().positive("Digite a largura em cm"),
  length: z.number().positive("Digite o comprimento em cm"),
});

export const updateProductSchema = z.object({
  id: z.string().trim().min(1, "Parâmetro id é obrigatório"),
  name: z.string().trim().min(1).optional(),
  price: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  category: z.enum(["FEM", "MASC", "SPORT", "BA", "FOOTWEAR"]).optional(),
  folder: z.string().trim().min(1).optional(),
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  width: z.number().positive().optional(),
  length: z.number().positive().optional(),
});

export const createVariationSchema = z.object({
  name: z.string().trim().min(1, "Digite um nome para a variação"),
});

export const createVariationSizeSchema = z.object({
  size: z.string().trim().min(1, "Digite o tamanho"),
  price: z.string().trim().min(1, "Digite um preço"),
  quantity: z.number().int().min(0, "Quantidade não pode ser negativa").default(0),
});

export const updateVariationSizeSchema = z.object({
  size: z.string().trim().min(1).optional(),
  price: z.string().trim().min(1).optional(),
  quantity: z.number().int().min(0).optional(),
});
