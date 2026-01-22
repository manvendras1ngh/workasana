import type { Task, User } from "../../types";
import { Card } from "../ui/Card";
import { StatusBadge } from "../ui/StatusBadge";

interface TaskCardProps {
  task: Task;
}

const formatDueDate = (timeToComplete: number): string => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + timeToComplete);
  return dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getOwnerNames = (owners: User[] | string[]): string => {
  if (!owners.length) return "Unassigned";
  if (typeof owners[0] === "string") return "Assigned";
  return (owners as User[]).map((o) => o.name).join(", ");
};

export const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <StatusBadge status={task.status} />
        <span className="text-xs text-gray-500">
          Due {formatDueDate(task.timeToComplete)}
        </span>
      </div>
      <h3 className="font-medium text-gray-900 mb-2">{task.name}</h3>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs">
            👤
          </span>
          {getOwnerNames(task.owners)}
        </span>
      </div>
    </Card>
  );
};
