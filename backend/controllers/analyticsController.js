const Task = require("../model/Task");

exports.getAnalytics = async (req, res) => {
  try {
    const completedTasks = await Task.countDocuments({ status: "Completed", assignee: req.user.id });
    const overdueTasks = await Task.countDocuments({ dueDate: { $lt: new Date() }, status: { $ne: "Completed" } });
    const completionRate = await Task.aggregate([
      { $match: { assignee: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: null, completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } }, total: { $sum: 1 } } },
      { $project: { rate: { $divide: ["$completed", "$total"] } } },
    ]);

    res.json({
      completedTasks,
      overdueTasks,
      completionRate: completionRate[0]?.rate || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};