import { useState } from "react";

const TaskFilter = ({ onFilter }) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleFilter = () => {
    onFilter({ title, status, priority, dueDate });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded mb-4">
      <h3 className="text-xl font-semibold mb-2">Filter Tasks</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Search by title or description"
        className="w-full p-2 mb-2 border rounded"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <button onClick={handleFilter} className="w-full p-2 bg-blue-500 text-white rounded">
        Apply Filters
      </button>
    </div>
  );
};

export default TaskFilter;