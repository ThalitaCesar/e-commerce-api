import { genSalt, hash, compare } from "bcryptjs";

export class HashManager {
  public generateHash = async (str: string) => {
    const rounds = Number(process.env.BCRYPT_COST);
    const salt = await genSalt(rounds);
    const result = await hash(str, salt);
    return result;
  };

  public compareHash = async (str: string, hash: string) => {
    const result = await compare(str, hash);
    return result;
  };
}