import asyncWrapper from "../utils/asyncWrapper.js";
import { User } from "../models/user.models.js";
import {
  generateHashedPassword,
  comparePasswordWithHash,
  generateBarerToken,
} from "../utils/auth.utils.js";

export const getUser = asyncWrapper(async (req, res) => {
  const { sub: id, username } = req.user;

  if (!id) return res.status(400).json({ error: "Not authenticated!" });

  const user = await User.findById(id).select("-password");
  if (!user) return res.status(400).json({ error: "User not found!" });

  return res.status(200).json({ data: user });
});

export const userSignup = asyncWrapper(async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password)
    return res.status(400).json({ message: "Missing required fields" });

  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  }).lean();

  if (userExists) {
    if (userExists.email === email) {
      return res.status(400).json({ message: "Email already registered!" });
    }
    if (userExists.username === username) {
      return res.status(400).json({ message: "Username already taken!" });
    }

    return res.status(400).json({ message: "User already exists!" });
  }

  const hashedPassword = await generateHashedPassword(password);
  const newUser = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  res.status(200).json({
    message: "user saved",
    data: {
      id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
    },
  });
});

export const userLogin = asyncWrapper(async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password)
    return res.status(400).json({ message: "Username or Password required!" });

  const user = await User.findOne({ username }).lean();
  if (!user) return res.status(400).json({ message: "User not found!" });

  const passwordCheck = await comparePasswordWithHash(password, user.password);
  if (!passwordCheck) {
    return res.status(400).json({ message: "Invalid username or password!" });
  }

  const bearerToken = generateBarerToken(user._id, user.username);

  res.cookie("access_token", bearerToken, {
    httpOnly: true,
  });
  return res.status(200).json({
    data: { name: user.name, username: user.username, email: user.email },
  });
});

export const userLogout = asyncWrapper((req, res) => {
  res.clearCookie("access_token", { httpOnly: true });
  return res.status(200).json({ message: "Logged out!" });
});
