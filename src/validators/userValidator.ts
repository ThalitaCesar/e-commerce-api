import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Digite um nome"),
  cpf: z.string().trim().optional().default(""),
  data: z.string().trim().optional().default(""),
  email: z.string().trim().email("Email invalido"),
  password: z.string().min(6, "Digite password valido, no mínimo 6 digitos"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Email invalido"),
  password: z.string().min(6, "Digite password valido, no mínimo 6 digitos"),
});

export const updateProfileSchema = z.object({
  id: z.string().trim().min(1, "Parâmetro id é obrigatório"),
  name: z.string().trim().min(1).optional(),
  cpf: z.string().trim().optional(),
  data: z.string().trim().optional(),
  email: z.string().trim().email("Email invalido").optional(),
});

export const updatePasswordSchema = z.object({
  id: z.string().trim().min(1, "Parâmetro id é obrigatório"),
  currentPassword: z.string().min(6, "Digite a senha atual").optional(),
  newPassword: z.string().min(6, "Digite password valido, no mínimo 6 digitos"),
});
