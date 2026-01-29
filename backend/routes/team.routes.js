import express from "express";

import { getTeams, getTeamById, addTeam, addMember } from "../controllers/team.controllers.js";

const router = express.Router();

router.get("/", getTeams);
router.get("/:teamId", getTeamById);
router.post("/", addTeam);
router.post("/:teamId/members", addMember);

export default router;
