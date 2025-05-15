import { useEffect, useState } from "react";
import TaskList from "../Task/TaskList";
import api from "../../services/api";

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await api.get("/tasks");
      setTasks(res.data);
    };
    fetchTasks();
  }, []);

  const assignedTasks = tasks.filter((task) => task.assignee?._id === localStorage.getItem("userId"));
  const createdTasks = tasks.filter((task) => task.creator._id === localStorage.getItem("userId"));
  const overdueTasks = tasks.filter((task) => new Date(task.dueDate) < new Date() && task.status !== "Completed");

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Task Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-xl font-semibold">Assigned to Me</h3>
          <TaskList tasks={assignedTasks} />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Created by Me</h3>
          <TaskList tasks={createdTasks} />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Overdue Tasks</h3>
          <TaskList tasks={overdueTasks} />
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;