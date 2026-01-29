import express from "express";

import {
  getLastWeekCompleted,
  getPendingWork,
  getClosedTasks,
} from "../controllers/report.controllers.js";

const router = express.Router();

router.get("/last-week", getLastWeekCompleted);
router.get("/pending", getPendingWork);
router.get("/closed-tasks", getClosedTasks);

export default router;
