import { useState } from "react";
import { Modal } from "../ui/Modal";
import { MultiSelect } from "../ui/MultiSelect";
import { useCreateTeam, useUsers } from "../../hooks/useQueries";
import toast from "react-hot-toast";
import axios from "axios";

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
    <Modal isOpen={isOpen} onClose={onClose} title="New Team">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="team-name" className="block text-sm font-medium text-gray-700 mb-1">
            Team Name
          </label>
          <input
            id="team-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter team name"
          />
        </div>
        <div>
          <label htmlFor="team-desc" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="team-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            disabled={createTeam.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {createTeam.isPending ? "Creating..." : "Create Team"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
