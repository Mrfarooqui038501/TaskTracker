const express = require("express");
const Task = require("../model/Task");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ creator: req.user.id }, { assignee: req.user.id }],
    });

    const completedTasks = tasks.filter((task) => task.status === "Completed").length;
    const overdueTasks = tasks.filter((task) => new Date(task.dueDate) < new Date() && task.status !== "Completed").length;
    const completionRate = tasks.length ? completedTasks / tasks.length : 0;

    res.json({ completedTasks, overdueTasks, completionRate });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;