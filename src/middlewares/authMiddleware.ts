import { NextFunction, Request, Response } from "express";
import { ROLES } from "../models/UserModel";
import { Autheticator } from "../services/Authenticator";
import { AppError } from "../utils/AppError";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      throw new AppError("Token não informado", 401);
    }
    const token = header.startsWith("Bearer ") ? header.slice(7) : header;
    const payload = new Autheticator().tokenData(token);
    req.user = { id: payload.id, role: payload.role as ROLES };
    next();
  } catch (error) {
    next(new AppError("Token inválido ou expirado", 401));
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== ROLES.ADMIN) {
    return next(new AppError("Acesso restrito a administradores", 403));
  }
  next();
}

export function requireSelfOrAdmin(getResourceUserId: (req: Request) => string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Token não informado", 401));
    }
    const resourceUserId = getResourceUserId(req);
    if (req.user.role === ROLES.ADMIN || req.user.id === resourceUserId) {
      return next();
    }
    return next(new AppError("Acesso negado", 403));
  };
}
