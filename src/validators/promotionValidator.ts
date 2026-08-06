import { z } from "zod";

export const createPromotionSchema = z
  .object({
    name: z.string().trim().min(1, "Digite um nome para a promoção"),
    discountPercent: z.number().positive("Desconto deve ser maior que zero").max(100, "Desconto não pode passar de 100%"),
    startDate: z.string().trim().min(1, "Digite a data de início (AAAA-MM-DD)"),
    endDate: z.string().trim().min(1, "Digite a data de término (AAAA-MM-DD)"),
    active: z.boolean().default(true),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "Data de início deve ser antes ou igual à data de término",
    path: ["endDate"],
  });

export const updatePromotionSchema = z.object({
  name: z.string().trim().min(1).optional(),
  discountPercent: z.number().positive().max(100).optional(),
  startDate: z.string().trim().min(1).optional(),
  endDate: z.string().trim().min(1).optional(),
  active: z.boolean().optional(),
});
