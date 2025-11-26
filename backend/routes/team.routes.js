import express from "express";

import { getTeams, addTeam } from "../controllers/team.controllers.js";

const router = express.Router();

router.get("/", getTeams);
router.post("/", addTeam);

export default router;
