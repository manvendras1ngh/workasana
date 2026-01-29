import { useNavigate } from "react-router-dom";
import type { Project } from "../../types";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="min-w-[280px] hover:shadow-md transition-shadow cursor-pointer py-4 gap-2"
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      <CardContent className="space-y-1">
        <CardTitle className="text-base">{project.name}</CardTitle>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardContent>
    </Card>
  );
};
