import { useState } from "react";
import { Modal } from "../ui/Modal";
import { MultiSelect } from "../ui/MultiSelect";
import { useCreateTask, useProjects, useTeams, useUsers, useTags } from "../../hooks/useQueries";
import type { TaskStatus } from "../../types";
import toast from "react-hot-toast";
import axios from "axios";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusOptions: TaskStatus[] = ["To Do", "In Progress", "Completed", "Blocked"];

export const NewTaskModal = ({ isOpen, onClose }: NewTaskModalProps) => {
  const [name, setName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [ownerIds, setOwnerIds] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState<TaskStatus>("To Do");
  const [timeToComplete, setTimeToComplete] = useState(1);

  const { data: projects } = useProjects();
  const { data: teams } = useTeams();
  const { data: users } = useUsers();
  const { data: tags } = useTags();
  const createTask = useCreateTask();

  const resetForm = () => {
    setName("");
    setProjectId("");
    setTeamId("");
    setOwnerIds([]);
    setSelectedTags([]);
    setStatus("To Do");
    setTimeToComplete(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !projectId || !teamId || !ownerIds.length) {
      toast.error("Please fill all required fields");
      return;
    }

    createTask.mutate(
      {
        name,
        project: projectId,
        team: teamId,
        owners: ownerIds,
        status,
        timeToComplete,
        tags: selectedTags,
      },
      {
        onSuccess: () => {
          toast.success("Task created!");
          resetForm();
          onClose();
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Failed to create task");
          }
        },
      }
    );
  };

  const userOptions = users?.map((u) => ({ value: u._id, label: u.name })) ?? [];
  const tagOptions = tags?.map((t) => ({ value: t.name, label: t.name })) ?? [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task-name" className="block text-sm font-medium text-gray-700 mb-1">
            Task Name *
          </label>
          <input
            id="task-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task name"
          />
        </div>

        <div>
          <label htmlFor="task-project" className="block text-sm font-medium text-gray-700 mb-1">
            Project *
          </label>
          <select
            id="task-project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select project</option>
            {projects?.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <MultiSelect
          id="task-owners"
          label="Owners (Team Members) *"
          options={userOptions}
          selected={ownerIds}
          onChange={setOwnerIds}
          placeholder="Select team members"
        />

        <div>
          <label htmlFor="task-team" className="block text-sm font-medium text-gray-700 mb-1">
            Team *
          </label>
          <select
            id="task-team"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select team</option>
            {teams?.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <MultiSelect
          id="task-tags"
          label="Tags"
          options={tagOptions}
          selected={selectedTags}
          onChange={setSelectedTags}
          placeholder="Select tags (e.g., Urgent, Bug)"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-days" className="block text-sm font-medium text-gray-700 mb-1">
              Time to Complete (days) *
            </label>
            <input
              id="task-days"
              type="number"
              min={1}
              value={timeToComplete}
              onChange={(e) => setTimeToComplete(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="task-status" className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createTask.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {createTask.isPending ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
