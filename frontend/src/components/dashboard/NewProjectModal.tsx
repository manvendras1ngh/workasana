import { useState } from "react";
import { useCreateProject } from "../../hooks/useQueries";
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

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal = ({ isOpen, onClose }: NewProjectModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createProject = useCreateProject();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast.error("All fields are required");
      return;
    }

    createProject.mutate(
      { name, description },
      {
        onSuccess: () => {
          toast.success("Project created!");
          setName("");
          setDescription("");
          onClose();
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response?.data?.error) {
            toast.error(error.response.data.error);
          } else {
            toast.error("Failed to create project");
          }
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Enter project name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-desc">Description</Label>
            <textarea
              id="project-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Enter project description"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProject.isPending}>
              {createProject.isPending ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
