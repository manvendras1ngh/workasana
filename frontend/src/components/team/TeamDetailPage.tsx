import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTeam, useUsers, useAddMember, useTeamTasks, useTags } from "../../hooks/useQueries";
import { Card } from "../ui/Card";
import { StatusBadge } from "../ui/StatusBadge";
import toast from "react-hot-toast";
import type { User, Task } from "../../types";

type SortField = "dueDate" | "priority";
type SortOrder = "asc" | "desc";

export const TeamDetailPage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { data: team, isLoading } = useTeam(teamId || "");
  const { data: users } = useUsers();
  const { data: tasks, isLoading: tasksLoading } = useTeamTasks(teamId || "");
  const { data: tags } = useTags();
  const addMember = useAddMember();

  const [showAddModal, setShowAddModal] = useState(false);
  const [ownerFilter, setOwnerFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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

  const handleAddMember = async (userId: string) => {
    if (!teamId) return;
    
    try {
      await addMember.mutateAsync({ teamId, userId });
      toast.success("Member added successfully!");
      setShowAddModal(false);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || "Failed to add member");
    }
  };

  // Get users who are not already members
  const availableUsers = users?.filter(
    (user) => !team?.members?.some((member) => member._id === user._id)
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Loading team...</div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Team not found</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
        >
          ← Back
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
            <p className="text-gray-500 mt-1">{team.description}</p>
            <p className="text-sm text-gray-400 mt-2">
              Created {formatDate(team.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Members
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center gap-1"
          >
            + Add Member
          </button>
        </div>

        {!team.members || team.members.length === 0 ? (
          <p className="text-gray-500">No members yet. Add your first team member!</p>
        ) : (
          <div className="space-y-3">
            {team.members.map((member) => (
              <div
                key={member._id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-medium">
                  {getInitials(member.name)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Tasks Section */}
      <div className="mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Team Tasks</h2>
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
          <div className="text-gray-500">No tasks found for this team.</div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Member</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Members Name
              </label>

              {availableUsers && availableUsers.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableUsers.map((user: User) => (
                    <button
                      key={user._id}
                      onClick={() => handleAddMember(user._id)}
                      disabled={addMember.isPending}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left transition-colors border border-gray-200"
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-medium">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-4">
                  All users are already members of this team.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
