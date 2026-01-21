export type TaskStatus = "To Do" | "In Progress" | "Completed" | "Blocked";

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Team {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  name: string;
  project: Project | string;
  team: Team | string;
  owners: User[] | string[];
  tags: string[];
  timeToComplete: number;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description: string;
}

export interface CreateTaskInput {
  name: string;
  project: string;
  team: string;
  owners: string[];
  tags: string[];
  timeToComplete: number;
  status: TaskStatus;
}

export interface CreateTeamInput {
  name: string;
  description: string;
}

export interface Tag {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  owner?: string;
  team?: string;
  tags?: string;
  project?: string;
  status?: string;
  sortBy?: "dueDate" | "status";
  sortOrder?: "asc" | "desc";
}

export interface LastWeekReport {
  totalCompleted: number;
  tasks: Task[];
  dailyBreakdown: Record<string, number>;
}

export interface PendingWorkReport {
  totalPendingDays: number;
  totalPendingTasks: number;
  byStatus: Record<string, number>;
  tasks: Task[];
}

export interface ClosedTasksReport {
  totalClosed: number;
  byTeam: Record<string, number>;
  byOwner: Record<string, number>;
  byProject: Record<string, number>;
}
