import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useTasks,
  useProjects,
  useTeams,
  useUsers,
  useTags,
} from "../../hooks/useQueries";
import { TaskCard } from "../dashboard/TaskCard";
import { NewTaskModal } from "../dashboard/NewTaskModal";
import type { TaskFilters, TaskStatus, Task } from "../../types";

const statusOptions: TaskStatus[] = [
  "To Do",
  "In Progress",
  "Completed",
  "Blocked",
];

export const TaskList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [filters, setFilters] = useState<TaskFilters>({
    owner: searchParams.get("owner") || "",
    team: searchParams.get("team") || "",
    tags: searchParams.get("tags") || "",
    project: searchParams.get("project") || "",
    status: searchParams.get("status") || "",
    sortBy: (searchParams.get("sortBy") as "dueDate" | "status") || undefined,
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
  });

  const { data: projects } = useProjects();
  const { data: teams } = useTeams();
  const { data: users } = useUsers();
  const { data: tags } = useTags();
  const { data: tasks, isLoading } = useTasks(
    Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== "" && v !== undefined),
    ) as TaskFilters,
  );

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const updateFilter = (key: keyof TaskFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      owner: "",
      team: "",
      tags: "",
      project: "",
      status: "",
      sortBy: undefined,
      sortOrder: "asc",
    });
  };

  const sortedTasks = useMemo(() => {
    if (!tasks) return [];
    const sorted = [...tasks];

    if (filters.sortBy === "dueDate") {
      sorted.sort((a, b) => {
        const diff = a.timeToComplete - b.timeToComplete;
        return filters.sortOrder === "desc" ? -diff : diff;
      });
    } else if (filters.sortBy === "status") {
      const statusOrder: Record<TaskStatus, number> = {
        "To Do": 0,
        "In Progress": 1,
        Blocked: 2,
        Completed: 3,
      };
      sorted.sort((a, b) => {
        const diff = statusOrder[a.status] - statusOrder[b.status];
        return filters.sortOrder === "desc" ? -diff : diff;
      });
    }

    return sorted;
  }, [tasks, filters.sortBy, filters.sortOrder]);

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => value && key !== "sortOrder",
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
        <button
          onClick={() => setShowTaskModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          + New Task
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-gray-700">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Owner
            </label>
            <select
              value={filters.owner}
              onChange={(e) => updateFilter("owner", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All</option>
              {users?.map((u) => (
                <option key={u._id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Team
            </label>
            <select
              value={filters.team}
              onChange={(e) => updateFilter("team", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All</option>
              {teams?.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Project
            </label>
            <select
              value={filters.project}
              onChange={(e) => updateFilter("project", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All</option>
              {projects?.map((p) => (
                <option key={p._id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Tags
            </label>
            <select
              value={filters.tags}
              onChange={(e) => updateFilter("tags", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All</option>
              {tags?.map((t) => (
                <option key={t._id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Sort By
            </label>
            <div className="flex gap-1">
              <select
                value={filters.sortBy || ""}
                onChange={(e) =>
                  updateFilter(
                    "sortBy",
                    e.target.value as "dueDate" | "status" | "",
                  )
                }
                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">None</option>
                <option value="dueDate">Due Date</option>
                <option value="status">Status</option>
              </select>
              <button
                onClick={() =>
                  updateFilter(
                    "sortOrder",
                    filters.sortOrder === "asc" ? "desc" : "asc",
                  )
                }
                className="px-2 py-1.5 text-sm border border-gray-300 rounded-r hover:bg-gray-50"
                title={filters.sortOrder === "asc" ? "Ascending" : "Descending"}
              >
                {filters.sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-gray-500">Loading tasks...</div>
      ) : sortedTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTasks.map((task: Task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No tasks found</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-2 text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <NewTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
      />
    </div>
  );
};
