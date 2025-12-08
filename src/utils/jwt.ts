import jwt, { SignOptions } from "jsonwebtoken";
import { Types } from "mongoose"

type JwtPayload = { id: Types.ObjectId };
type JWTSettings = SignOptions | undefined;

interface VerifyTokenResult {
  data: JwtPayload | null;
  error: Error | null;
}

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not define in environment variables");
}

export const generateToken = (
  payload: JwtPayload,
  settings: JWTSettings,
): string => jwt.sign(payload, JWT_SECRET, settings);

export const verifyToken = (token: string): VerifyTokenResult => {
  try {
    const data = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return { data, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error };
    }
    const resultError = new Error("Token error");
    return { data: null, error: resultError };
  }
};
