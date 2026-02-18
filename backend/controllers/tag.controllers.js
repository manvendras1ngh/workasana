import asyncWrapper from "../utils/asyncWrapper.js";
import { Tag } from "../models/tag.models.js";

export const getTags = asyncWrapper(async (req, res) => {
  const tags = await Tag.find().lean();

  if (!tags.length) return res.status(400).json({ error: "No tags found" });

  return res.status(200).json({ message: "Tags found", data: tags });
});

export const addTag = asyncWrapper(async (req, res) => {
  const { tagName } = req.body;

  if (!tagName)
    return res.status(400).json({ error: "Missing required field" });

  const tags = await Tag.find({ name: tagName }).lean();
  const tagExists = tags.find((t) => t.name === tagName);

  if (tagExists) return res.status(400).json({ error: "Tag already exists" });

  const newTag = await Tag.create({ name: tagName });

  return res.status(200).json({ message: "Tag created", data: newTag });
});
