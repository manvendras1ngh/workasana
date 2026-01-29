import axios from "axios";
import type {
  User,
  Project,
  Task,
  Team,
  Tag,
  CreateProjectInput,
  CreateTaskInput,
  CreateTeamInput,
  TaskFilters,
  TaskStatus,
  LastWeekReport,
  PendingWorkReport,
  ClosedTasksReport,
} from "../types";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const authApi = {
  login: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<User> => {
    const res = await api.post("/auth/login", { username, password });
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  signup: async ({
    name,
    username,
    email,
    password,
  }: {
    name: string;
    username: string;
    email: string;
    password: string;
  }): Promise<User> => {
    const res = await api.post("/auth/signup", {
      name,
      username,
      email,
      password,
    });
    return res.data.data;
  },

  me: async (): Promise<User> => {
    const res = await api.get("/auth/me");
    return res.data.data;
  },
};

export const projectApi = {
  getAll: async (): Promise<Project[]> => {
    const res = await api.get("/projects");
    return res.data.data;
  },

  getById: async (id: string): Promise<Project> => {
    const res = await api.get(`/projects/${id}`);
    return res.data.data;
  },

  create: async (data: CreateProjectInput): Promise<Project> => {
    const res = await api.post("/projects", data);
    return res.data.data;
  },
};

export const taskApi = {
  getAll: async (filters?: TaskFilters): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.owner) params.append("owner", filters.owner);
      if (filters.team) params.append("team", filters.team);
      if (filters.tags) params.append("tags", filters.tags);
      if (filters.project) params.append("project", filters.project);
      if (filters.status) params.append("status", filters.status);
    }
    const queryString = params.toString();
    const res = await api.get(`/tasks${queryString ? `?${queryString}` : ""}`);
    return res.data.data;
  },

  getById: async (id: string): Promise<Task> => {
    const res = await api.get(`/tasks/${id}`);
    return res.data.data;
  },

  getByProject: async (projectId: string): Promise<Task[]> => {
    const res = await api.get(`/tasks/project/${projectId}`);
    return res.data.data;
  },

  getByTeam: async (teamId: string): Promise<Task[]> => {
    const res = await api.get(`/tasks/team/${teamId}`);
    return res.data.data;
  },

  create: async (data: CreateTaskInput): Promise<Task> => {
    const res = await api.post("/tasks", data);
    return res.data.data;
  },

  updateStatus: async (id: string, status: TaskStatus): Promise<Task> => {
    const res = await api.patch(`/tasks/${id}/status`, { status });
    return res.data.data;
  },
};

export const teamApi = {
  getAll: async (): Promise<Team[]> => {
    const res = await api.get("/teams");
    return res.data.data;
  },

  getById: async (id: string): Promise<Team> => {
    const res = await api.get(`/teams/${id}`);
    return res.data.data;
  },

  create: async (data: CreateTeamInput): Promise<Team> => {
    const res = await api.post("/teams", data);
    return res.data.data;
  },

  addMember: async (teamId: string, userId: string): Promise<Team> => {
    const res = await api.post(`/teams/${teamId}/members`, { userId });
    return res.data.data;
  },
};

export const userApi = {
  getAll: async (): Promise<User[]> => {
    const res = await api.get("/users");
    return res.data.data;
  },
};

export const tagApi = {
  getAll: async (): Promise<Tag[]> => {
    const res = await api.get("/tags");
    return res.data.data;
  },
};

export const reportApi = {
  getLastWeek: async (): Promise<LastWeekReport> => {
    const res = await api.get("/report/last-week");
    return res.data.data;
  },

  getPending: async (): Promise<PendingWorkReport> => {
    const res = await api.get("/report/pending");
    return res.data.data;
  },

  getClosedTasks: async (): Promise<ClosedTasksReport> => {
    const res = await api.get("/report/closed-tasks");
    return res.data.data;
  },
};
