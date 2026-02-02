import asyncWrapper from "../utils/asyncWrapper.js";
import { User } from "../models/user.models.js";

export const getUsers = asyncWrapper(async (req, res) => {
  const users = await User.find().select("-password").lean();

  if (!users.length) return res.status(400).json({ error: "No users found" });

  return res.status(200).json({ message: "All users", data: users });
});
