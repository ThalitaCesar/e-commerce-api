import { z } from "zod";

export const createOrderSchema = z.object({
  name: z.string().trim().min(1, "Digite um nome"),
  folder: z.string().trim().min(1, "Digite a pasta"),
  size: z.string().trim().min(1, "Digite o tamanho"),
  price: z.string().trim().min(1, "Digite um preço"),
});
