const Task = require("../model/Task");

exports.scheduleRecurringTask = async (task) => {
  const interval = {
    Daily: 1 * 24 * 60 * 60 * 1000,
    Weekly: 7 * 24 * 60 * 60 * 1000,
    Monthly: 30 * 24 * 60 * 60 * 1000,
  }[task.recurring];

  setInterval(async () => {
    const newTask = new Task({
      ...task.toObject(),
      _id: undefined,
      dueDate: new Date(Date.now() + interval),
      createdAt: new Date(),
    });
    await newTask.save();
  }, interval);
};