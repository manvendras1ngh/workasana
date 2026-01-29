import asyncWrapper from "../utils/asyncWrapper.js";
import { Project } from "../models/project.models.js";

export const getProjects = asyncWrapper(async (req, res) => {
  const projects = await Project.find().lean();

  if (!projects.length)
    return res.status(400).json({ error: "No projects found" });

  return res.status(200).json({ message: "All projects", data: projects });
});

export const getProjectById = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "Project ID is required" });

  const project = await Project.findById(id).lean();

  if (!project) return res.status(404).json({ error: "Project not found" });

  return res.status(200).json({ data: project });
});

export const addProject = asyncWrapper(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description)
    return res.status(400).json({ error: "Missing required fields" });

  const newProject = await Project.create({
    name,
    description,
  });

  return res.status(200).json({ message: "Project created", data: newProject });
});
