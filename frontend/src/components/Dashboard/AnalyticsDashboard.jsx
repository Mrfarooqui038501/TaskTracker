import { useEffect, useState } from "react";
import api from "../../services/api";

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/analytics");
        setAnalytics(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch analytics");
        setAnalytics({ completedTasks: 0, overdueTasks: 0, completionRate: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading analytics...</div>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold">Completed Tasks</h3>
          <p>{analytics.completedTasks || 0}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold">Overdue Tasks</h3>
          <p>{analytics.overdueTasks || 0}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold">Completion Rate</h3>
          <p>{((analytics.completionRate || 0) * 100).toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;