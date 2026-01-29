import { useState } from "react";
import { useCreateTask, useProjects, useTeams, useUsers, useTags } from "../../hooks/useQueries";
import type { TaskStatus } from "../../types";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-name">Task Name *</Label>
            <input
              id="task-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Enter task name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-project">Project *</Label>
            <select
              id="task-project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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

          <div className="space-y-2">
            <Label htmlFor="task-team">Team *</Label>
            <select
              id="task-team"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
            <div className="space-y-2">
              <Label htmlFor="task-days">Time to Complete (days) *</Label>
              <input
                id="task-days"
                type="number"
                min={1}
                value={timeToComplete}
                onChange={(e) => setTimeToComplete(Number(e.target.value))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-status">Status *</Label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createTask.isPending}>
              {createTask.isPending ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
