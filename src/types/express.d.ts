import { ROLES } from "../models/UserModel";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: ROLES;
      };
    }
  }
}

export {};
