import { useState } from "react";
import { useCreateTeam, useUsers } from "../../hooks/useQueries";
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

interface NewTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTeamModal = ({ isOpen, onClose }: NewTeamModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const createTeam = useCreateTeam();
  const { data: users } = useUsers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast.error("Name and description are required");
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error("Please select at least one team member");
      return;
    }

    createTeam.mutate(
      { name, description, members: selectedMembers },
      {
        onSuccess: () => {
          toast.success("Team created!");
          setName("");
          setDescription("");
          setSelectedMembers([]);
          onClose();
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response?.data?.error) {
            toast.error(error.response.data.error);
          } else {
            toast.error("Failed to create team");
          }
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team-name">Team Name</Label>
            <input
              id="team-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Enter team name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team-desc">Description</Label>
            <textarea
              id="team-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Enter team description"
            />
          </div>
          <div>
            <MultiSelect
              id="team-members"
              label="Team Members"
              placeholder="Select team members..."
              options={
                users?.map((user) => ({
                  value: user._id,
                  label: user.name,
                })) || []
              }
              selected={selectedMembers}
              onChange={setSelectedMembers}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createTeam.isPending}>
              {createTeam.isPending ? "Creating..." : "Create Team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
