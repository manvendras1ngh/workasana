import type { Team } from "../../types";
import { Card } from "../ui/Card";

interface TeamCardProps {
  team: Team;
}

export const TeamCard = ({ team }: TeamCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="min-w-[280px] hover:shadow-md transition-shadow cursor-pointer">
      <div className="mb-2">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          Team
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{team.name}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{team.description}</p>
      <div className="text-xs text-gray-400">
        Created {formatDate(team.createdAt)}
      </div>
    </Card>
  );
};
