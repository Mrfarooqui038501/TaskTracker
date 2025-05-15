import { useState, useEffect } from "react";
import api from "../../services/api";

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignee, setAssignee] = useState("");
  const [recurring, setRecurring] = useState("None");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await api.get("/users");
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const task = { title, description, dueDate, priority, assignee, recurring };
    await api.post("/tasks", task);
    onTaskCreated();
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Medium");
    setAssignee("");
    setRecurring("None");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Create Task</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="">Select Assignee</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>{user.username}</option>
        ))}
      </select>
      <select
        value={recurring}
        onChange={(e) => setRecurring(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="None">None</option>
        <option value="Daily">Daily</option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
      </select>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Create Task</button>
    </form>
  );
};

export default TaskForm;