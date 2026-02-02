import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 12;
const tokenExpiryTime = "1d";

export const generateHashedPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    throw new Error(error);
  }
};

export const comparePasswordWithHash = async (password, hash) => {
  try {
    const check = await bcrypt.compare(password, hash);
    return check;
  } catch (error) {
    throw new Error(error);
  }
};

export const generateBarerToken = (id, username) => {
  const secret = process.env.SECRET_KEY;
  if (!secret) throw new Error("Missing JWT secret");

  const token = jwt.sign({ sub: id, username: username }, secret, {
    expiresIn: tokenExpiryTime,
  });
  return token;
};
