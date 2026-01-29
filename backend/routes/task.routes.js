import express from "express";

import {
  createTask,
  getTask,
  getTaskById,
  getTasksByProject,
  getTasksByTeam,
  updateTaskStatus,
} from "../controllers/task.controllers.js";

const router = express.Router();

router.get("/", getTask);
router.get("/project/:projectId", getTasksByProject);
router.get("/team/:teamId", getTasksByTeam);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.patch("/:id/status", updateTaskStatus);

export default router;
