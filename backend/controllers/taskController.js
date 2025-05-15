const Task = require("../model/Task"); // Assuming your model is in ../model/Task
const { logAction } = require("../utils/auditLog");
const { sendEmailNotification } = require("../utils/email");
const { scheduleRecurringTask } = require("../utils/recurringTask");

exports.createTask = async (req, res) => {
  const { title, description, dueDate, priority, assignee, recurring } = req.body;

  // For debugging: Log incoming data and user object
  console.log("createTask - req.body:", req.body);
  console.log("createTask - req.user:", req.user);

  if (!req.user || !req.user.id) {
    console.error("createTask Error: User not authenticated or user ID missing.");
    // It's often better to send a 401 or 403 for auth issues
    return res.status(401).json({ message: "User not authenticated." });
  }

  try {
    const taskData = {
      title,
      description,
      dueDate,
      priority,
      creator: req.user.id,
      recurring,
    };

    // Only add assignee if it's a non-empty string and presumably a valid ID
    if (assignee && assignee.trim() !== "") {
      taskData.assignee = assignee;
    } else {
      // If your schema allows assignee to be explicitly null or undefined for no assignee
      // taskData.assignee = null; // or leave it out if your schema handles its absence
    }

    const task = new Task(taskData);
    await task.save();

    console.log("Task created successfully:", task._id);

    // Perform subsequent actions, but consider if their failure should block the 201 response.
    try {
      await logAction(req.user.id, task._id, "Task Created", `Task ${title} created`);
    } catch (logError) {
      console.error("Error logging action:", logError.message);
      // Decide if you want to do something else here, like send a different response or just log
    }

    if (task.assignee) {
      try {
        const io = req.app.get("io"); // Get socket.io instance
        if (io) {
          io.to(task.assignee.toString()).emit("notification", { message: `Task "${title}" assigned to you` });
        } else {
          console.warn("Socket.io instance (io) not found on req.app for task notification.");
        }
        await sendEmailNotification(task.assignee.toString(), "Task Assigned", `Task "${title}" has been assigned to you`);
      } catch (notifyError) {
        console.error("Error sending notification/email:", notifyError.message);
      }
    }

    if (recurring && recurring !== "None") {
      try {
        scheduleRecurringTask(task);
      } catch (scheduleError) {
        console.error("Error scheduling recurring task:", scheduleError.message);
      }
    }

    res.status(201).json(task);

  } catch (err) {
    console.error("ERROR in createTask:", err); // Log the full error on the server
    if (err.name === 'ValidationError') {
      // Mongoose validation error
      return res.status(400).json({ message: "Validation Error: " + err.message, errors: err.errors });
    }
    // Generic server error
    res.status(500).json({ message: "Server error creating task: " + err.message });
  }
};

exports.getTasks = async (req, res) => {
  console.log("getTasks - req.user:", req.user);
  if (!req.user || !req.user.id) {
    console.error("getTasks Error: User not authenticated or user ID missing.");
    return res.status(401).json({ message: "User not authenticated." });
  }
  try {
    const tasks = await Task.find({ $or: [{ creator: req.user.id }, { assignee: req.user.id }] })
      .populate("creator", "username")
      .populate("assignee", "username");
    res.json(tasks);
  } catch (err) {
    console.error("ERROR in getTasks:", err);
    res.status(500).json({ message: "Error fetching tasks: " + err.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  console.log(`updateTask - ID: ${id}, req.body:`, req.body);
  console.log("updateTask - req.user:", req.user);

  if (!req.user || !req.user.id) {
    console.error("updateTask Error: User not authenticated or user ID missing.");
    return res.status(401).json({ message: "User not authenticated." });
  }

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Optional: Add authorization logic (e.g., only creator or assignee can update)
    // if (task.creator.toString() !== req.user.id && (!task.assignee || task.assignee.toString() !== req.user.id)) {
    //   return res.status(403).json({ message: "Not authorized to update this task." });
    // }

    // Update only the fields that are present in req.body
    // Ensure req.body does not contain fields like 'creator' if they shouldn't be updatable this way
    const allowedUpdates = ['title', 'description', 'dueDate', 'priority', 'assignee', 'recurring', 'status']; // Add 'status' or other updatable fields
    Object.keys(req.body).forEach(key => {
        if(allowedUpdates.includes(key)){
            task[key] = req.body[key];
        }
    });
    
    // Handle empty assignee specifically if needed for updates
    if (req.body.assignee === "" || req.body.assignee === null) {
        task.assignee = undefined; // Or null, depending on your schema, to remove assignee
    }


    await task.save();
    console.log("Task updated successfully:", task._id);

    try {
      await logAction(req.user.id, task._id, "Task Updated", `Task ${task.title} updated`);
    } catch (logError) {
      console.error("Error logging task update:", logError.message);
    }

    if (task.assignee) { // If assignee still exists or was just set
      try {
        const io = req.app.get("io");
        if (io) {
          io.to(task.assignee.toString()).emit("notification", { message: `Task "${task.title}" updated` });
        } else {
          console.warn("Socket.io instance (io) not found on req.app for task update notification.");
        }
      } catch (notifyError) {
        console.error("Error sending update notification:", notifyError.message);
      }
    }

    res.json(task);
  } catch (err) {
    console.error("ERROR in updateTask:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation Error: " + err.message, errors: err.errors });
    }
    res.status(500).json({ message: "Server error updating task: " + err.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  console.log(`deleteTask - ID: ${id}`);
  console.log("deleteTask - req.user:", req.user);

  if (!req.user || !req.user.id) {
    console.error("deleteTask Error: User not authenticated or user ID missing.");
    return res.status(401).json({ message: "User not authenticated." });
  }

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Optional: Add authorization logic (e.g., only creator can delete)
    // if (task.creator.toString() !== req.user.id) {
    //    return res.status(403).json({ message: "Not authorized to delete this task." });
    // }

    // await task.remove(); // .remove() is deprecated on documents.
    await Task.findByIdAndDelete(id); // Or task.deleteOne() if you already have the document.

    console.log("Task deleted successfully:", id);

    try {
      await logAction(req.user.id, id, "Task Deleted", `Task ${task.title} (ID: ${id}) deleted`);
    } catch (logError) {
      console.error("Error logging task deletion:", logError.message);
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("ERROR in deleteTask:", err);
    res.status(500).json({ message: "Server error deleting task: " + err.message });
  }
};