import asyncWrapper from "../utils/asyncWrapper.js";
import { Task } from "../models/task.models.js";
import { User } from "../models/User.models.js";
import { Project } from "../models/project.models.js";

export const createTask = asyncWrapper(async (req, res) => {
  const { name, project, team, owners, tags, timeToComplete, status } =
    req.body;

  if (
    !name ||
    !project ||
    !team ||
    !owners.length ||
    !timeToComplete ||
    !status
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newTask = await Task.create({
    name,
    project,
    team,
    owners,
    tags,
    timeToComplete,
    status,
  });

  return res.status(200).json({ message: "Task created", data: newTask });
});

const allowedFilters = ["team", "owner", "project", "status", "tags"];

export const getTask = asyncWrapper(async (req, res) => {
  const query = {};

  for (const key of Object.keys(req.query)) {
    if (!allowedFilters.includes(key)) continue;

    const val = req.query[key];
    if (val === null || val === "") continue;

    if (key === "tags") {
      const tags = val
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      if (tags.length) query.tags = { $in: tags };
      continue;
    }
    if (key === "owner") {
      const owners = val
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      if (owners.length) {
        const ownerDetails = await User.find({ name: { $in: owners } }).lean();
        const ownerIds = ownerDetails.map((owner) => owner._id);
        query.owners = { $in: ownerIds };
      }
      continue;
    }
    if (["team", "project", "status"].includes(key)) {
      if (key === "project") {
        const projectDetails = await Project.find({ name: val }).lean();
        query.project = projectDetails[0]._id;
      } else {
        query[key] = val;
      }
      continue;
    }
  }

  const task = await Task.find(query).lean();
  if (!task.length) return res.status(400).json({ error: "No task found" });

  return res.status(200).json({ message: "Task list", data: task });
});

export const getTaskById = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "Task ID is required" });

  const task = await Task.findById(id)
    .populate("project", "name description")
    .populate("team", "name description")
    .populate("owners", "name username email")
    .lean();

  if (!task) return res.status(404).json({ error: "Task not found" });

  return res.status(200).json({ data: task });
});

export const getTasksByProject = asyncWrapper(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId)
    return res.status(400).json({ error: "Project ID is required" });

  const tasks = await Task.find({ project: projectId })
    .populate("owners", "name username email")
    .lean();

  return res.status(200).json({ data: tasks });
});

export const getTasksByTeam = asyncWrapper(async (req, res) => {
  const { teamId } = req.params;

  if (!teamId) return res.status(400).json({ error: "Team ID is required" });

  const tasks = await Task.find({ team: teamId })
    .populate("owners", "name username email")
    .populate("project", "name description")
    .lean();

  return res.status(200).json({ data: tasks });
});

export const updateTaskStatus = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) return res.status(400).json({ error: "Task ID is required" });
  if (!status) return res.status(400).json({ error: "Status is required" });

  const validStatuses = ["To Do", "In Progress", "Completed", "Blocked"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  const updatedTask = await Task.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  ).lean();

  if (!updatedTask) return res.status(404).json({ error: "Task not found" });

  return res.status(200).json({ message: "Task updated", data: updatedTask });
});

export const udpateTask = asyncWrapper(async (req, res) => {
  const { id, name, team, owners, timeToComplete, status, tags } = req.body;
  if (!id) return res.status(400).json({ message: "Id is required" });

  if (
    !name ||
    !team ||
    !owners.length ||
    !timeToComplete ||
    !tags.length ||
    !status
  ) {
    return res
      .status(400)
      .json({ message: "Missing required fields for update" });
  }

  //logic for updating task, update name, team, owners, timetocomplete and status only.
  //what and how it should be updated
  //do i need the og values to fill and update or just the values that i need to update
});

export const deleteTask = asyncWrapper(async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ message: "Id is required" });

  const task = await Task.findByIdAndDelete({ _id: id });

  if (!task)
    return res.status(400).json({ message: "Task with given id not found!" });

  return res.status(200).json({ message: "Task with given id deleted" });
});
