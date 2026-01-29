import { Badge } from "@/components/ui/badge"
import type { TaskStatus } from "../../types"
import { cn } from "@/lib/utils"

const statusStyles: Record<TaskStatus, string> = {
  "To Do": "bg-gray-100 text-gray-700 border-gray-200",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
  Completed: "bg-green-100 text-green-700 border-green-200",
  Blocked: "bg-red-100 text-red-700 border-red-200",
}

interface StatusBadgeProps {
  status: TaskStatus
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge className={cn("border", statusStyles[status])}>
      {status}
    </Badge>
  )
}
