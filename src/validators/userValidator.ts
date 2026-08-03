import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Digite um nome"),
  cpf: z.string().trim().optional().default(""),
  data: z.string().trim().optional().default(""),
  email: z.string().trim().email("Email invalido"),
  password: z.string().min(6, "Digite password valido, no mínimo 6 digitos"),
  role: z.enum(["NORMAL", "ADMIN"]).optional().default("NORMAL"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Email invalido"),
  password: z.string().min(6, "Digite password valido, no mínimo 6 digitos"),
});
