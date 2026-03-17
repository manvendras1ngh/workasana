import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTask, useUpdateTaskStatus } from "../../hooks/useQueries";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import type { Project, Team, User } from "../../types";
import { EditTaskModal } from "../dashboard/EditTaskModal";

export const TaskDetailPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: task, isLoading } = useTask(taskId || "");
  const updateStatus = useUpdateTaskStatus();

  const handleMarkComplete = () => {
    if (!taskId) return;

    updateStatus.mutate(
      { taskId, status: "Completed" },
      {
        onSuccess: () => {
          toast.success("Task marked as complete!");
        },
        onError: () => {
          toast.error("Failed to update task status");
        },
      },
    );
  };

  const calculateTimeRemaining = () => {
    if (!task) return "N/A";
    const days = task.timeToComplete;
    if (days <= 0) return "Overdue";
    if (days === 1) return "1 Day";
    return `${days} Days`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getProjectName = () => {
    if (!task?.project) return "-";
    const project = task.project as Project;
    return typeof project === "string" ? project : project.name;
  };

  const getTeamName = () => {
    if (!task?.team) return "-";
    const team = task.team as Team;
    return typeof team === "string" ? team : team.name;
  };

  const getOwnerNames = () => {
    if (!task?.owners?.length) return "-";
    const owners = task.owners as User[];
    return owners.map((o) => (typeof o === "string" ? o : o.name)).join(", ");
  };

  const getTagsList = () => {
    if (!task?.tags?.length) return "-";
    return task.tags.join(", ");
  };

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading task...</div>;
  }

  if (!task) {
    return <div className="p-6 text-gray-500">Task not found</div>;
  }

  const isCompleted = task.status === "Completed";

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
        >
          <span>←</span> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Task: {task.name}</h1>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <StatusBadge status={task.status} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Time Remaining:</span>
            <span
              className={`text-sm font-medium ${
                task.timeToComplete <= 1 ? "text-red-600" : "text-gray-900"
              }`}
            >
              {calculateTimeRemaining()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            Edit Task
          </button>
          {!isCompleted && (
            <button
              onClick={handleMarkComplete}
              disabled={updateStatus.isPending}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm disabled:opacity-50"
            >
              {updateStatus.isPending ? "Updating..." : "Mark as Complete"}
            </button>
          )}
        </div>
      </div>

      <Card className="max-w-3xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Task Details
        </h2>
        <div className="space-y-4">
          <div className="flex border-b border-gray-100 pb-3">
            <span className="w-32 text-sm text-gray-500">Project:</span>
            <span className="text-sm text-gray-900 font-medium">
              {getProjectName()}
            </span>
          </div>
          <div className="flex border-b border-gray-100 pb-3">
            <span className="w-32 text-sm text-gray-500">Team:</span>
            <span className="text-sm text-gray-900 font-medium">
              {getTeamName()}
            </span>
          </div>
          <div className="flex border-b border-gray-100 pb-3">
            <span className="w-32 text-sm text-gray-500">Owner:</span>
            <span className="text-sm text-gray-900 font-medium">
              {getOwnerNames()}
            </span>
          </div>
          <div className="flex border-b border-gray-100 pb-3">
            <span className="w-32 text-sm text-gray-500">Tags:</span>
            <span className="text-sm text-gray-900 font-medium">
              {getTagsList()}
            </span>
          </div>
          <div className="flex border-b border-gray-100 pb-3">
            <span className="w-32 text-sm text-gray-500">Due Date:</span>
            <span className="text-sm text-gray-900 font-medium">
              {task.timeToComplete} days remaining
            </span>
          </div>
          <div className="flex border-b border-gray-100 pb-3">
            <span className="w-32 text-sm text-gray-500">Status:</span>
            <StatusBadge status={task.status} />
          </div>
          <div className="flex">
            <span className="w-32 text-sm text-gray-500">Created:</span>
            <span className="text-sm text-gray-900 font-medium">
              {formatDate(task.createdAt)}
            </span>
          </div>
        </div>
      </Card>

      {/* Edit Task Modal */}
      {task && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={task}
        />
      )}
    </div>
  );
};
