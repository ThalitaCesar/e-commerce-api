import { z } from "zod";

const cardPaymentSchema = z.object({
  method: z.enum(["CREDIT_CARD", "DEBIT_CARD"]),
  token: z.string().trim().min(1, "Token do cartão é obrigatório"),
  paymentMethodId: z.string().trim().min(1, "paymentMethodId é obrigatório"),
  installments: z.number().int().min(1).max(12).optional().default(1),
});

const pixPaymentSchema = z.object({
  method: z.literal("PIX"),
});

export const createPaymentSchema = z.discriminatedUnion("method", [
  cardPaymentSchema,
  pixPaymentSchema,
]);
