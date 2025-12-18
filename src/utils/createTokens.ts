import { Types } from "mongoose";

import { generateToken } from "./jwt.js";

const createTokens = (id: Types.ObjectId) => {
  const accessToken: string = generateToken({ id }, { expiresIn: "1d" });
  const refreshToken: string = generateToken(
    { id },
    {
      expiresIn: "7d",
    },
  );
  return {
    accessToken,
    refreshToken,
  };
};

export default createTokens;
