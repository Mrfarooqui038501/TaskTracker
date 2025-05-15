import { useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const TaskItem = ({ task, onTaskUpdated }) => {
  const { user } = useContext(AuthContext);

  const handleUpdate = async (status) => {
    await api.put(`/tasks/${task._id}`, { status });
    onTaskUpdated();
  };

  const handleDelete = async () => {
    await api.delete(`/tasks/${task._id}`);
    onTaskUpdated();
  };

  return (
    <div className="p-4 bg-white shadow-md rounded mb-2 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <p>{task.description}</p>
        <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
        <p>Priority: {task.priority}</p>
        <p>Status: {task.status}</p>
        <p>Assignee: {task.assignee?.username || "Unassigned"}</p>
      </div>
      {(user.role === "Admin" || user.role === "Manager") && (
        <div className="space-x-2">
          <select
            value={task.status}
            onChange={(e) => handleUpdate(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded">Delete</button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;