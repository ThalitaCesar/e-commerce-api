import { z } from "zod";

export const createAdressesSchema = z.object({
  cep: z.string().trim().min(1, "Digite o CEP"),
  street: z.string().trim().min(1, "Digite a rua"),
  district: z.string().trim().min(1, "Digite o bairro"),
  city: z.string().trim().min(1, "Digite a cidade"),
  number: z.string().trim().min(1, "Digite o número"),
  state: z.string().trim().min(1, "Digite o estado"),
  complement: z.string().trim().optional().default(""),
});

export const updateAdressesSchema = z.object({
  id: z.string().trim().min(1, "Parâmetro id é obrigatório"),
  cep: z.string().trim().min(1).optional(),
  street: z.string().trim().min(1).optional(),
  district: z.string().trim().min(1).optional(),
  city: z.string().trim().min(1).optional(),
  number: z.string().trim().min(1).optional(),
  state: z.string().trim().min(1).optional(),
  complement: z.string().trim().optional(),
});
