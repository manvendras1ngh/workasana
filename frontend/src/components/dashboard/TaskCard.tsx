import { useNavigate } from "react-router-dom";
import type { Task, User } from "../../types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";

interface TaskCardProps {
  task: Task;
}

const formatDueDate = (timeToComplete: number): string => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + timeToComplete);
  return dueDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (name: string): string => {
  const colors = [
    "bg-orange-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-zinc-500",
    "bg-indigo-500",
  ];
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const getOwnerName = (owner: User | string): string => {
  return typeof owner === "string" ? "Unknown" : owner.name || "Unknown";
};

export const TaskCard = ({ task }: TaskCardProps) => {
  const navigate = useNavigate();
  const owners = task.owners as User[];

  const renderOwners = () => {
    if (!owners?.length) return null;

    if (owners.length === 1) {
      const ownerName = getOwnerName(owners[0]);
      return (
        <div className="flex items-center gap-2">
          <Avatar size="sm" title={ownerName}>
            <AvatarFallback
              className={`${getRandomColor(ownerName)} text-white text-xs`}
            >
              {getInitials(ownerName)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{ownerName}</span>
        </div>
      );
    }

    return (
      <AvatarGroup>
        {owners.slice(0, 3).map((owner) => {
          const name = getOwnerName(owner);
          const key = typeof owner === "string" ? owner : owner._id || name;
          return (
            <Avatar key={key} size="sm" title={name}>
              <AvatarFallback
                className={`${getRandomColor(name)} text-white text-xs`}
              >
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
          );
        })}
        {owners.length > 3 && (
          <AvatarGroupCount title={`+${owners.length - 3} more`}>
            +{owners.length - 3}
          </AvatarGroupCount>
        )}
      </AvatarGroup>
    );
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer py-4 gap-2"
      onClick={() => navigate(`/tasks/${task._id}`)}
    >
      <CardContent className="space-y-2">
        <StatusBadge status={task.status} />
        <h3 className="font-semibold text-gray-900 text-base leading-tight">
          {task.name}
        </h3>
        <p className="text-sm text-gray-500">
          Due on: {formatDueDate(task.timeToComplete)}
        </p>
        {renderOwners()}
      </CardContent>
    </Card>
  );
};
