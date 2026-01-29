import asyncWrapper from "../utils/asyncWrapper.js";
import { Task } from "../models/task.models.js";
import { Team } from "../models/team.models.js";
import { User } from "../models/User.models.js";
import { Project } from "../models/project.models.js";

export const getLastWeekCompleted = asyncWrapper(async (req, res) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const tasks = await Task.find({
    status: "Completed",
    updatedAt: { $gte: oneWeekAgo },
  })
    .populate("project", "name")
    .populate("team", "name")
    .populate("owners", "name")
    .lean();

  const dailyBreakdown = tasks.reduce((acc, task) => {
    const day = new Date(task.updatedAt).toLocaleDateString("en-US", {
      weekday: "short",
    });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  return res.status(200).json({
    data: {
      totalCompleted: tasks.length,
      tasks,
      dailyBreakdown,
    },
  });
});

export const getPendingWork = asyncWrapper(async (req, res) => {
  const pendingTasks = await Task.find({
    status: { $ne: "Completed" },
  })
    .populate("project", "name")
    .populate("team", "name")
    .lean();

  const totalPendingDays = pendingTasks.reduce(
    (sum, task) => sum + (task.timeToComplete || 0),
    0
  );

  const byStatus = pendingTasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + task.timeToComplete;
    return acc;
  }, {});

  return res.status(200).json({
    data: {
      totalPendingDays,
      totalPendingTasks: pendingTasks.length,
      byStatus,
      tasks: pendingTasks,
    },
  });
});

export const getClosedTasks = asyncWrapper(async (req, res) => {
  const completedTasks = await Task.find({ status: "Completed" })
    .populate("project", "name")
    .populate("team", "name")
    .populate("owners", "name")
    .lean();

  const byTeam = completedTasks.reduce((acc, task) => {
    const teamName = task.team?.name || "Unassigned";
    acc[teamName] = (acc[teamName] || 0) + 1;
    return acc;
  }, {});

  const byOwner = completedTasks.reduce((acc, task) => {
    if (task.owners?.length) {
      task.owners.forEach((owner) => {
        const ownerName = owner?.name || "Unknown";
        acc[ownerName] = (acc[ownerName] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const byProject = completedTasks.reduce((acc, task) => {
    const projectName = task.project?.name || "No Project";
    acc[projectName] = (acc[projectName] || 0) + 1;
    return acc;
  }, {});

  return res.status(200).json({
    data: {
      totalClosed: completedTasks.length,
      byTeam,
      byOwner,
      byProject,
    },
  });
});
