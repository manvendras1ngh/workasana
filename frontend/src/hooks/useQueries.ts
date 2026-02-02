import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, projectApi, taskApi, teamApi, userApi, tagApi, reportApi } from "../api/api";
import type { CreateProjectInput, CreateTaskInput, CreateTeamInput, TaskFilters, TaskStatus } from "../types";

export const useAuthUser = () => {
  return useQuery({
    queryKey: ["user", "auth"],
    queryFn: authApi.me,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(["user", "auth"], null);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: projectApi.getAll,
    retry: false,
  });
};

export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => projectApi.getById(projectId),
    enabled: !!projectId,
    retry: false,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectInput) => projectApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useTasks = (filters?: TaskFilters) => {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => taskApi.getAll(filters),
    retry: false,
  });
};

export const useTask = (taskId: string) => {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: () => taskApi.getById(taskId),
    enabled: !!taskId,
    retry: false,
  });
};

export const useProjectTasks = (projectId: string) => {
  return useQuery({
    queryKey: ["tasks", "project", projectId],
    queryFn: () => taskApi.getByProject(projectId),
    enabled: !!projectId,
    retry: false,
  });
};

export const useTeamTasks = (teamId: string) => {
  return useQuery({
    queryKey: ["tasks", "team", teamId],
    queryFn: () => taskApi.getByTeam(teamId),
    enabled: !!teamId,
    retry: false,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskInput) => taskApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      taskApi.updateStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: Partial<CreateTaskInput> }) =>
      taskApi.update(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: teamApi.getAll,
    retry: false,
  });
};

export const useTeam = (teamId: string) => {
  return useQuery({
    queryKey: ["teams", teamId],
    queryFn: () => teamApi.getById(teamId),
    enabled: !!teamId,
    retry: false,
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTeamInput) => teamApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useAddMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      teamApi.addMember(teamId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["teams", variables.teamId] });
    },
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: userApi.getAll,
    retry: false,
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: tagApi.getAll,
    retry: false,
  });
};

export const useLastWeekReport = () => {
  return useQuery({
    queryKey: ["reports", "last-week"],
    queryFn: reportApi.getLastWeek,
    retry: false,
  });
};

export const usePendingWorkReport = () => {
  return useQuery({
    queryKey: ["reports", "pending"],
    queryFn: reportApi.getPending,
    retry: false,
  });
};

export const useClosedTasksReport = () => {
  return useQuery({
    queryKey: ["reports", "closed-tasks"],
    queryFn: reportApi.getClosedTasks,
    retry: false,
  });
};
