import { useNavigate } from "react-router-dom";
import type { Team } from "../../types";
import { Card } from "../ui/Card";

interface TeamCardProps {
  team: Team;
}

export const TeamCard = ({ team }: TeamCardProps) => {
  const navigate = useNavigate();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const members = team.members || [];
  const displayedMembers = members.slice(0, 3);
  const remainingCount = members.length - 3;

  return (
    <Card
      className="min-w-[280px] hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/team/${team._id}`)}
    >
      <div className="mb-2">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          Team
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{team.name}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
        {team.description}
      </p>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {displayedMembers.map((member) => (
              <div
                key={member._id}
                className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-medium border-2 border-white"
                title={member.name}
              >
                {getInitials(member.name)}
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-medium border-2 border-white">
                +{remainingCount}
              </div>
            )}
          </div>
          <span className="ml-3 text-sm text-gray-600">
            {members.length} {members.length === 1 ? "member" : "members"}
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-400">
        Created {formatDate(team.createdAt)}
      </div>
    </Card>
  );
};
