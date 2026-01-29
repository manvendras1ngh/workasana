import { useState } from "react";
import { useTeams } from "../../hooks/useQueries";
import { TeamCard } from "../dashboard/TeamCard";
import { NewTeamModal } from "../dashboard/NewTeamModal";

export const TeamPage = () => {
  const [showTeamModal, setShowTeamModal] = useState(false);
  const { data: teams, isLoading } = useTeams();

  return (
    <div className="p-6">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
          <button
            onClick={() => setShowTeamModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            + New Team
          </button>
        </div>

        {isLoading ? (
          <div className="text-gray-500">Loading teams...</div>
        ) : teams?.length ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {teams.map((team) => (
              <TeamCard key={team._id} team={team} />
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No teams found. Create your first team!</div>
        )}
      </section>

      <NewTeamModal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
      />
    </div>
  );
};
