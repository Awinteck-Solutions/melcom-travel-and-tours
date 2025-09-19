import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv"; 

dotenv.config();
const { JWT_SECRET = "" } = process.env;
export class encrypt {
  static async encryptpass(password: string) {
    return await bcrypt.hash(password, 12);
  }
  static async comparepassword(password: string, hashPassword: string) {
    return await bcrypt.compare(password, hashPassword);
  }

  static async generateToken(payload: any) {
    return await jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
  }
}