import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  useLastWeekReport,
  usePendingWorkReport,
  useClosedTasksReport,
} from "../../hooks/useQueries";
import { Card } from "@/components/ui/Card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const chartColors = [
  "rgba(59, 130, 246, 0.8)",
  "rgba(16, 185, 129, 0.8)",
  "rgba(249, 115, 22, 0.8)",
  "rgba(139, 92, 246, 0.8)",
  "rgba(236, 72, 153, 0.8)",
  "rgba(14, 165, 233, 0.8)",
  "rgba(245, 158, 11, 0.8)",
  "rgba(99, 102, 241, 0.8)",
];

const chartBorderColors = [
  "rgba(59, 130, 246, 1)",
  "rgba(16, 185, 129, 1)",
  "rgba(249, 115, 22, 1)",
  "rgba(139, 92, 246, 1)",
  "rgba(236, 72, 153, 1)",
  "rgba(14, 165, 233, 1)",
  "rgba(245, 158, 11, 1)",
  "rgba(99, 102, 241, 1)",
];

export const ReportsPage = () => {
  const { data: lastWeekData, isLoading: lastWeekLoading } =
    useLastWeekReport();
  const { data: pendingData, isLoading: pendingLoading } =
    usePendingWorkReport();
  const { data: closedData, isLoading: closedLoading } = useClosedTasksReport();

  const isLoading = lastWeekLoading || pendingLoading || closedLoading;

  const lastWeekChartData = {
    labels: lastWeekData?.dailyBreakdown
      ? Object.keys(lastWeekData.dailyBreakdown)
      : [],
    datasets: [
      {
        label: "Tasks Completed",
        data: lastWeekData?.dailyBreakdown
          ? Object.values(lastWeekData.dailyBreakdown)
          : [],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pendingByStatusData = {
    labels: pendingData?.byStatus ? Object.keys(pendingData.byStatus) : [],
    datasets: [
      {
        label: "Days Pending",
        data: pendingData?.byStatus ? Object.values(pendingData.byStatus) : [],
        backgroundColor: chartColors.slice(
          0,
          Object.keys(pendingData?.byStatus || {}).length,
        ),
        borderColor: chartBorderColors.slice(
          0,
          Object.keys(pendingData?.byStatus || {}).length,
        ),
        borderWidth: 1,
      },
    ],
  };

  const closedByTeamData = {
    labels: closedData?.byTeam ? Object.keys(closedData.byTeam) : [],
    datasets: [
      {
        label: "Tasks Closed",
        data: closedData?.byTeam ? Object.values(closedData.byTeam) : [],
        backgroundColor: chartColors.slice(
          0,
          Object.keys(closedData?.byTeam || {}).length,
        ),
        borderColor: chartBorderColors.slice(
          0,
          Object.keys(closedData?.byTeam || {}).length,
        ),
        borderWidth: 1,
      },
    ],
  };

  const closedByOwnerData = {
    labels: closedData?.byOwner ? Object.keys(closedData.byOwner) : [],
    datasets: [
      {
        label: "Tasks Closed",
        data: closedData?.byOwner ? Object.values(closedData.byOwner) : [],
        backgroundColor: chartColors.slice(
          0,
          Object.keys(closedData?.byOwner || {}).length,
        ),
        borderColor: chartBorderColors.slice(
          0,
          Object.keys(closedData?.byOwner || {}).length,
        ),
        borderWidth: 1,
      },
    ],
  };

  const closedByProjectData = {
    labels: closedData?.byProject ? Object.keys(closedData.byProject) : [],
    datasets: [
      {
        label: "Tasks Closed",
        data: closedData?.byProject ? Object.values(closedData.byProject) : [],
        backgroundColor: chartColors.slice(
          0,
          Object.keys(closedData?.byProject || {}).length,
        ),
        borderColor: chartBorderColors.slice(
          0,
          Object.keys(closedData?.byProject || {}).length,
        ),
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "right" as const },
    },
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>
        <div className="text-gray-500">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="text-center">
          <div className="text-4xl font-bold text-gray-900">
            {lastWeekData?.totalCompleted || 0}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Tasks Completed Last Week
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-gray-900">
            {pendingData?.totalPendingDays || 0}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Total Days of Work Pending
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-gray-900">
            {closedData?.totalClosed || 0}
          </div>
          <div className="text-sm text-gray-500 mt-1">Total Tasks Closed</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Work Done Last Week
          </h2>
          {Object.keys(lastWeekData?.dailyBreakdown || {}).length > 0 ? (
            <Bar data={lastWeekChartData} options={barOptions} />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No tasks completed last week
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pending Work by Status
          </h2>
          {Object.keys(pendingData?.byStatus || {}).length > 0 ? (
            <div className="max-w-xs mx-auto">
              <Doughnut data={pendingByStatusData} options={pieOptions} />
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              No pending tasks
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tasks Closed by Team
          </h2>
          {Object.keys(closedData?.byTeam || {}).length > 0 ? (
            <Pie data={closedByTeamData} options={pieOptions} />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No closed tasks
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tasks Closed by Owner
          </h2>
          {Object.keys(closedData?.byOwner || {}).length > 0 ? (
            <Bar
              data={closedByOwnerData}
              options={{
                ...barOptions,
                indexAxis: "y" as const,
              }}
            />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No closed tasks
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tasks Closed by Project
          </h2>
          {Object.keys(closedData?.byProject || {}).length > 0 ? (
            <Pie data={closedByProjectData} options={pieOptions} />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No closed tasks
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
