
import * as jwt from "jsonwebtoken";
import { AuthenticationData } from "../types/types";


export class Autheticator {
  public generateToken = (id: string) => {
    const token = jwt.sign( { id }, process.env.JWT_KEY as string, {
     expiresIn: "1h" 
    });
    return token;
  };

  public tokenData = (token: string): AuthenticationData => {
    const payload = jwt.verify(
      token,
      process.env.JWT_KEY as string
    ) as AuthenticationData;
    return payload;
  };
}