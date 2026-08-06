import { z } from "zod";

export const createOrderSchema = z.object({
  productId: z.string().trim().min(1, "Digite o id do produto"),
  variationSizeId: z.string().trim().min(1).optional(),
  quantity: z.number().int().positive("Quantidade deve ser maior que zero").default(1),
});
