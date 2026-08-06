import { z } from "zod";

export const quoteShippingSchema = z.object({
  destinationPostalCode: z
    .string()
    .trim()
    .regex(/^\d{8}$/, "CEP deve ter 8 dígitos, sem traço"),
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1, "Digite o id do produto"),
        quantity: z.number().int().positive("Quantidade deve ser maior que zero"),
      })
    )
    .min(1, "Informe ao menos um item"),
});
