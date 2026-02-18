import { useState, useMemo, useEffect, useRef } from "react";
import {
  useCreateTask,
  useCreateTag,
  useProjects,
  useTeams,
  useUsers,
  useTags,
} from "../../hooks/useQueries";
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
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "../ui/combobox";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusOptions: TaskStatus[] = [
  "To Do",
  "In Progress",
  "Completed",
  "Blocked",
];

export const NewTaskModal = ({ isOpen, onClose }: NewTaskModalProps) => {
  const [name, setName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [ownerIds, setOwnerIds] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInputValue, setTagInputValue] = useState("");
  const [status, setStatus] = useState<TaskStatus>("To Do");
  const [timeToComplete, setTimeToComplete] = useState(1);

  const { data: projects } = useProjects();
  const { data: teams } = useTeams();
  const { data: users } = useUsers();
  const { data: tags } = useTags();
  const createTask = useCreateTask();
  const createTag = useCreateTag();

  const anchor = useComboboxAnchor();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [tagPopupOpen, setTagPopupOpen] = useState(false);

  // Filter owner options to only show members from selected team
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
    if (teamId) {
      setOwnerIds([]);
    }
  }, [teamId]);

  const resetForm = () => {
    setName("");
    setProjectId("");
    setTeamId("");
    setOwnerIds([]);
    setSelectedTags([]);
    setTagInputValue("");
    setTagPopupOpen(false);
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
      <DialogContent ref={dialogRef} className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

          <div className="space-y-2">
            <Label>Tags</Label>
            <Combobox
              multiple
              autoHighlight
              items={tagOptions}
              value={selectedTags}
              open={tagPopupOpen}
              onOpenChange={(open, eventDetails) => {
                // In multiple mode, keep popup open after item selection
                if (!open && eventDetails.reason === "item-press") return;
                setTagPopupOpen(open);
              }}
              onValueChange={(values, eventDetails) => {
                // Ignore programmatic resets (e.g. popup close reverting to initial value)
                if (eventDetails.reason === "none") return;
                setSelectedTags(values);
              }}
              inputValue={tagInputValue}
              onInputValueChange={(value) => {
                setTagInputValue(value);
              }}
            >
              <ComboboxChips ref={anchor} className="w-full">
                <ComboboxValue>
                  {(tags) => (
                    <>
                      {Array.isArray(tags) &&
                        tags.map((tag: string) => (
                          <ComboboxChip key={tag}>
                            {tag}
                          </ComboboxChip>
                        ))}
                      <ComboboxChipsInput placeholder="Search or create tags..." />
                    </>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={anchor} container={dialogRef} className="cursor-pointer">
                {tagInputValue &&
                  !tagOptions.some(
                    (t) =>
                      t.value.toLowerCase() === tagInputValue.toLowerCase(),
                  ) && (
                    <div
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleCreateTag(tagInputValue.trim());
                        setTagInputValue("");
                      }}
                      className="cursor-pointer p-2 hover:bg-accent text-sm"
                    >
                      Create tag "{tagInputValue.trim()}"
                    </div>
                  )}
                <ComboboxList>
                  {(tag) => (
                    <ComboboxItem key={tag.value} value={tag.value}>
                      {tag.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

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
