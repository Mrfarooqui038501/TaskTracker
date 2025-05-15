import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold mb-4">Task Management System</h1>
      <p className="mb-4">Manage your team's tasks efficiently.</p>
      <div className="space-x-4">
        <Link to="/login" className="p-2 bg-blue-500 text-white rounded">Login</Link>
        <Link to="/register" className="p-2 bg-green-500 text-white rounded">Register</Link>
      </div>
    </div>
  );
};

export default Home;