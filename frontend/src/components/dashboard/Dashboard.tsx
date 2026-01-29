import { useState } from "react";
import { useProjects, useTasks } from "../../hooks/useQueries";
import { NewProjectModal } from "./NewProjectModal";
import { NewTaskModal } from "./NewTaskModal";
import { ProjectCard } from "./ProjectCard";
import { TaskCard } from "./TaskCard";

export const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  const filteredProjects = projects?.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredTasks = tasks?.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects and tasks..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
          <button
            onClick={() => setShowProjectModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            + New Project
          </button>
        </div>

        {projectsLoading ? (
          <div className="text-gray-500">Loading projects...</div>
        ) : filteredProjects?.length ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No projects found</div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">My Tasks</h2>
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            + New Task
          </button>
        </div>

        {tasksLoading ? (
          <div className="text-gray-500">Loading tasks...</div>
        ) : filteredTasks?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No tasks found</div>
        )}
      </section>

      <NewProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
      />
      <NewTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
      />
    </div>
  );
};
