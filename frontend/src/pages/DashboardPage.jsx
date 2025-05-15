import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import TaskDashboard from "../components/Dashboard/TaskDashboard";
import TaskFilter from "../components/Dashboard/TaskFilter";
import AnalyticsDashboard from "../components/Dashboard/AnalyticsDashboard";
import TaskForm from "../components/Task/TaskForm";
import Notifications from "../components/Notification/Notifications";
import api from "../services/api";

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchTasks = async () => {
      try {
        setLoadingTasks(true);
        setError(null);
        const res = await api.get("/tasks");
        setAllTasks(res.data);
        setFilteredTasks(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch tasks");
        setAllTasks([]);
        setFilteredTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, [user, navigate]);

  const handleFilter = (filters) => {
    let filtered = [...allTasks];

    if (filters.priority && filters.priority !== "All") {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }

    if (filters.dueDate) {
      const filterDate = new Date(filters.dueDate);
      filtered = filtered.filter((task) => {
        const taskDueDate = new Date(task.dueDate);
        return (
          taskDueDate.getFullYear() === filterDate.getFullYear() &&
          taskDueDate.getMonth() === filterDate.getMonth() &&
          taskDueDate.getDate() === filterDate.getDate()
        );
      });
    }

    if (filters.assignee) {
      filtered = filtered.filter((task) => task.assignee?._id === filters.assignee);
    }

    setFilteredTasks(filtered);
  };

  const handleTaskCreated = async () => {
    try {
      const res = await api.get("/tasks");
      setAllTasks(res.data);
      setFilteredTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to refresh tasks");
    }
  };

  if (!user) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button onClick={logout} className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
          Logout
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loadingTasks ? (
        <div className="text-center p-8">Loading tasks...</div>
      ) : (
        <>
          {(user.role === "Admin" || user.role === "Manager") && (
            <TaskForm onTaskCreated={handleTaskCreated} />
          )}

          <TaskFilter onFilter={handleFilter} />

          {filteredTasks.length > 0 ? (
            <TaskDashboard tasks={filteredTasks} />
          ) : (
            <p className="text-center text-gray-500 mt-4">No tasks found.</p>
          )}

          <AnalyticsDashboard />

          <Notifications />
        </>
      )}
    </div>
  );
};

export default DashboardPage;