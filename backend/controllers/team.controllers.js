import asyncWrapper from "../utils/asyncWrapper.js";
import { Team } from "../models/team.models.js";

export const getTeams = asyncWrapper(async (req, res) => {
  const teams = await Team.find().lean();

  if (!teams.length) return res.status(400).json({ error: "No team found" });

  return res.status(200).json({ message: "All Teams", data: teams });
});

export const addTeam = asyncWrapper(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description)
    return res.status(400).json({ error: "Missing required fields" });

  const newTeam = await Team.create({
    name,
    description,
  });

  return res.status(200).json({ message: "Team created", data: newTeam });
});
