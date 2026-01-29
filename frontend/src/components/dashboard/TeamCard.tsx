import { useNavigate } from "react-router-dom";
import type { Team } from "../../types";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";

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

  return (
    <Card
      className="min-w-[280px] hover:shadow-md transition-shadow cursor-pointer p-4"
      onClick={() => navigate(`/team/${team._id}`)}
    >
      <CardContent className="p-0 space-y-3">
        <div>
          <Badge variant="secondary" className="mb-2">
            Team
          </Badge>
          <CardTitle className="text-base mb-1">{team.name}</CardTitle>
          <CardDescription className="line-clamp-2">{team.description}</CardDescription>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AvatarGroup>
              {members.slice(0, 3).map((member) => (
                <Avatar key={member._id} title={member.name}>
                  <AvatarFallback className="bg-indigo-500 text-white">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {members.length > 3 && (
                <AvatarGroupCount>+{members.length - 3}</AvatarGroupCount>
              )}
            </AvatarGroup>
            <span className="text-sm text-muted-foreground">
              {members.length} {members.length === 1 ? "member" : "members"}
            </span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">Created {formatDate(team.createdAt)}</div>
      </CardContent>
    </Card>
  );
};
