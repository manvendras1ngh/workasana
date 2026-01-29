import { useState } from "react";
import { useProjects } from "../../hooks/useQueries";
import { NewProjectModal } from "../dashboard/NewProjectModal";
import { ProjectCard } from "../dashboard/ProjectCard";

export const ProjectsPage = () => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const { data: projects, isLoading } = useProjects();

  return (
    <div className="p-6">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <button
            onClick={() => setShowProjectModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            + New Project
          </button>
        </div>

        {isLoading ? (
          <div className="text-gray-500">Loading projects...</div>
        ) : projects?.length ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No projects found. Create your first project!</div>
        )}
      </section>

      <NewProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
      />
    </div>
  );
};
