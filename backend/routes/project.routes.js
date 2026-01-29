import express from "express";

import { getProjects, getProjectById, addProject } from "../controllers/project.controllers.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", addProject);

export default router;
