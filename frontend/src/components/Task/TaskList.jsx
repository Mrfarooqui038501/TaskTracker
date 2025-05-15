import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onTaskUpdated }) => {
  return (
    <div>
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} onTaskUpdated={onTaskUpdated} />
      ))}
    </div>
  );
};

export default TaskList;