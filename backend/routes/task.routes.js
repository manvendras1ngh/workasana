import express from "express";

import { createTask, getTask } from "../controllers/task.controllers.js";

const router = express.Router();

router.get("/", getTask);
router.post("/", createTask);

export default router;
