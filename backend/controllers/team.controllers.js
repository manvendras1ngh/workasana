import asyncWrapper from "../utils/asyncWrapper.js";
import { Team } from "../models/team.models.js";

export const getTeams = asyncWrapper(async (req, res) => {
  const teams = await Team.find()
    .populate("members", "name email username")
    .lean();

  if (!teams.length) return res.status(400).json({ error: "No team found" });

  return res.status(200).json({ message: "All Teams", data: teams });
});

export const getTeamById = asyncWrapper(async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId)
    .populate("members", "name email username")
    .lean();

  if (!team) return res.status(404).json({ error: "Team not found" });

  return res.status(200).json({ message: "Team details", data: team });
});

export const addTeam = asyncWrapper(async (req, res) => {
  const { name, description, members } = req.body;

  if (!name || !description)
    return res.status(400).json({ error: "Missing required fields" });

  const newTeam = await Team.create({
    name,
    description,
    members: members || [],
  });

  const populatedTeam = await Team.findById(newTeam._id)
    .populate("members", "name email username")
    .lean();

  return res.status(200).json({ message: "Team created", data: populatedTeam });
});

export const addMember = asyncWrapper(async (req, res) => {
  const { teamId } = req.params;
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: "User ID is required" });

  const team = await Team.findById(teamId);

  if (!team) return res.status(404).json({ error: "Team not found" });

  if (team.members.includes(userId)) {
    return res.status(400).json({ error: "User is already a member" });
  }

  team.members.push(userId);
  await team.save();

  const updatedTeam = await Team.findById(teamId)
    .populate("members", "name email username")
    .lean();

  return res.status(200).json({ message: "Member added", data: updatedTeam });
});
