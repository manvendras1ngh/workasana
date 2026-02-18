import { useState, useEffect, useMemo } from "react";
import {
  useUpdateTask,
  useCreateTag,
  useProjects,
  useTeams,
  useUsers,
  useTags,
} from "../../hooks/useQueries";
import type { TaskStatus, Task, Project, Team, User } from "../../types";
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

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

const statusOptions: TaskStatus[] = [
  "To Do",
  "In Progress",
  "Completed",
  "Blocked",
];

export const EditTaskModal = ({
  isOpen,
  onClose,
  task,
}: EditTaskModalProps) => {
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
  const updateTask = useUpdateTask();
  const createTag = useCreateTag();

  // Populate form with existing task data
  useEffect(() => {
    if (task && isOpen) {
      setName(task.name);

      const projectData = task.project as Project;
      setProjectId(
        typeof projectData === "string" ? projectData : projectData._id,
      );

      const teamData = task.team as Team;
      setTeamId(typeof teamData === "string" ? teamData : teamData._id);

      const ownerData = task.owners as User[];
      setOwnerIds(
        ownerData.map((owner) =>
          typeof owner === "string" ? owner : owner._id,
        ),
      );

      setSelectedTags(task.tags || []);
      setStatus(task.status);
      setTimeToComplete(task.timeToComplete);
    }
  }, [task, isOpen]);

  const filteredOwnerOptions = useMemo(() => {
    if (!teamId || !teams || !users) return [];

    const selectedTeam = teams.find((t) => t._id === teamId);
    if (!selectedTeam) return [];

    const teamMemberIds = selectedTeam.members.map((m) =>
      typeof m === "string" ? m : m._id,
    );

    return users
      .filter((u) => teamMemberIds.includes(u._id))
      .map((u) => ({ value: u._id, label: u.name }));
  }, [teamId, teams, users]);

  useEffect(() => {
    if (!teamId || !teams || ownerIds.length === 0) return;

    const selectedTeam = teams.find((t) => t._id === teamId);
    if (!selectedTeam) return;

    const teamMemberIds = selectedTeam.members.map((m) =>
      typeof m === "string" ? m : m._id,
    );

    const validOwners = ownerIds.filter((id) => teamMemberIds.includes(id));
    if (validOwners.length !== ownerIds.length) {
      setOwnerIds(validOwners);
    }
  }, [teamId, teams, ownerIds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !projectId || !teamId || !ownerIds.length) {
      toast.error("Please fill all required fields");
      return;
    }

    updateTask.mutate(
      {
        taskId: task._id,
        data: {
          name,
          project: projectId,
          team: teamId,
          owners: ownerIds,
          status,
          timeToComplete,
          tags: selectedTags,
        },
      },
      {
        onSuccess: () => {
          toast.success("Task updated successfully!");
          onClose();
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Failed to update task");
          }
        },
      },
    );
  };

  const tagOptions = tags?.map((t) => ({ value: t.name, label: t.name })) ?? [];

  const handleCreateTag = (tagName: string) => {
    createTag.mutate(tagName, {
      onSuccess: () => {
        setSelectedTags((prev) => [...prev, tagName]);
        toast.success(`Tag "${tagName}" created`);
      },
      onError: () => {
        toast.error("Failed to create tag");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
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

          {teamId && (
            <MultiSelect
              id="task-owners"
              label="Owners (Team Members) *"
              options={filteredOwnerOptions}
              selected={ownerIds}
              onChange={setOwnerIds}
              placeholder="Select team members"
            />
          )}

          <MultiSelect
            id="task-tags"
            label="Tags"
            options={tagOptions}
            selected={selectedTags}
            onChange={setSelectedTags}
            onCreateOption={handleCreateTag}
            placeholder="Select tags"
            searchPlaceholder="Search or create tags..."
            creatable
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
            <Button type="submit" disabled={updateTask.isPending}>
              {updateTask.isPending ? "Updating..." : "Update Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
