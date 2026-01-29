import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLogout, useAuthUser } from "../../hooks/useQueries";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/tasks", label: "Tasks", icon: "✓" },
  { path: "/projects", label: "Projects", icon: "📁" },
  { path: "/team", label: "Team", icon: "👥" },
  { path: "/reports", label: "Reports", icon: "📈" },
  { path: "/settings", label: "Settings", icon: "⚙️" },
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: user } = useAuthUser();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <aside
      className={`h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!isCollapsed && <h1 className="text-xl font-bold">Workasana</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded hover:bg-gray-700"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="flex-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        {!isCollapsed && user && (
          <div className="mb-3 text-sm text-gray-400">
            <p className="font-medium text-white">{user.name}</p>
            <p className="text-xs">@{user.username}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
        >
          <span>🚪</span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
