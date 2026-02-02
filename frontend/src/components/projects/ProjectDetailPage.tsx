import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject, useProjectTasks, useUsers, useTags } from "../../hooks/useQueries";
import { StatusBadge } from "@/components/ui/status-badge";
import { NewTaskModal } from "../dashboard/NewTaskModal";
import type { Task, User } from "../../types";

type SortField = "dueDate" | "priority";
type SortOrder = "asc" | "desc";

export const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [ownerFilter, setOwnerFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const { data: project, isLoading: projectLoading } = useProject(projectId || "");
  const { data: tasks, isLoading: tasksLoading } = useProjectTasks(projectId || "");
  const { data: users } = useUsers();
  const { data: tags } = useTags();

  const filteredAndSortedTasks = useMemo(() => {
    if (!tasks) return [];

    let result = [...tasks];

    if (ownerFilter) {
      result = result.filter((task) => {
        const owners = task.owners as User[];
        return owners.some((owner) =>
          typeof owner === "string" ? owner === ownerFilter : owner._id === ownerFilter
        );
      });
    }

    if (tagFilter) {
      result = result.filter((task) => task.tags.includes(tagFilter));
    }

    result.sort((a, b) => {
      if (sortField === "dueDate") {
        const aVal = a.timeToComplete;
        const bVal = b.timeToComplete;
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      if (sortField === "priority") {
        const priorityOrder = { Blocked: 0, "In Progress": 1, "To Do": 2, Completed: 3 };
        const aVal = priorityOrder[a.status] ?? 4;
        const bVal = priorityOrder[b.status] ?? 4;
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return result;
  }, [tasks, ownerFilter, tagFilter, sortField, sortOrder]);

  const formatOwners = (task: Task) => {
    const owners = task.owners as User[];
    if (!owners?.length) return "-";
    return owners.map((o) => (typeof o === "string" ? o : o.name)).join(", ");
  };

  const formatTags = (task: Task) => {
    if (!task.tags?.length) return "-";
    return task.tags.join(", ");
  };

  if (projectLoading) {
    return <div className="p-6 text-gray-500">Loading project...</div>;
  }

  if (!project) {
    return <div className="p-6 text-gray-500">Project not found</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
          >
            <span>←</span> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Project: {project.name}
          </h1>
        </div>
        <button
          onClick={() => setShowTaskModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
        >
          + Add Task
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filters:</span>
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">By Owner</option>
            {users?.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">By Tag</option>
            {tags?.map((tag) => (
              <option key={tag._id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-600">Sort by:</span>
          <button
            onClick={() => {
              setSortField("dueDate");
              setSortOrder(sortField === "dueDate" && sortOrder === "asc" ? "desc" : "asc");
            }}
            className={`px-3 py-2 rounded-lg text-sm ${
              sortField === "dueDate"
                ? "bg-blue-500 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Due Date {sortField === "dueDate" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => {
              setSortField("priority");
              setSortOrder(sortField === "priority" && sortOrder === "asc" ? "desc" : "asc");
            }}
            className={`px-3 py-2 rounded-lg text-sm ${
              sortField === "priority"
                ? "bg-blue-500 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Priority {sortField === "priority" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      {tasksLoading ? (
        <div className="text-gray-500">Loading tasks...</div>
      ) : filteredAndSortedTasks.length ? (
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Task Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Owner</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Due Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedTasks.map((task) => (
                <tr
                  key={task._id}
                  onClick={() => navigate(`/tasks/${task._id}`)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{task.name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatOwners(task)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{task.timeToComplete} days</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatTags(task)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500">No tasks found for this project.</div>
      )}

      <NewTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
      />
    </div>
  );
};
