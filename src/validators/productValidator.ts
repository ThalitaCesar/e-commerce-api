import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Digite um nome"),
  description: z.string().trim().min(1, "Digite uma descrição"),
  price: z.string().trim().min(1, "Digite um preço"),
  created: z.string().trim().min(1, "Digite a data de criação"),
  category: z.enum(["FEM", "MASC", "SPORT", "BA", "FOOTWEAR"]),
  folder: z.string().trim().min(1, "Digite a pasta"),
});

export const updateProductSchema = z.object({
  id: z.string().trim().min(1, "Parâmetro id é obrigatório"),
  name: z.string().trim().min(1).optional(),
  price: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  category: z.enum(["FEM", "MASC", "SPORT", "BA", "FOOTWEAR"]).optional(),
  folder: z.string().trim().min(1).optional(),
});
