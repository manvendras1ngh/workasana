import express from "express";

import { getProjects, addProject } from "../controllers/project.controllers.js";

const router = express.Router();

router.get("/", getProjects);
router.post("/", addProject);

export default router;
