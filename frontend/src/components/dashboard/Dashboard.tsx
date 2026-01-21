import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects, useTasks } from "../../hooks/useQueries";
import { Card } from "../ui/Card";
import { StatusBadge } from "../ui/StatusBadge";
import { NewProjectModal } from "./NewProjectModal";
import { NewTaskModal } from "./NewTaskModal";
import type { Project, Task, User } from "../../types";

const ProjectCardClickable = ({ project }: { project: Project }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="min-w-[280px] hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      <div className="mb-2">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          Active
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
      <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
    </Card>
  );
};

const TaskCardClickable = ({ task }: { task: Task }) => {
  const navigate = useNavigate();
  const owners = task.owners as User[];

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/tasks/${task._id}`)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{task.name}</h3>
        <StatusBadge status={task.status} />
      </div>
      <div className="text-sm text-gray-500 mb-2">
        {task.timeToComplete} days remaining
      </div>
      {owners?.length > 0 && (
        <div className="flex -space-x-2">
          {owners.slice(0, 3).map((owner, index) => (
            <div
              key={typeof owner === "string" ? owner : owner._id || index}
              className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
            >
              {typeof owner === "string" ? "?" : owner.name?.charAt(0).toUpperCase()}
            </div>
          ))}
          {owners.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-gray-600 text-xs font-medium">
              +{owners.length - 3}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  const filteredProjects = projects?.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTasks = tasks?.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
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
              <ProjectCardClickable key={project._id} project={project} />
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
              <TaskCardClickable key={task._id} task={task} />
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
