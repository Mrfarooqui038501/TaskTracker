const express = require("express");
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const router = express.Router();

router.use(authMiddleware);

router.post("/", roleMiddleware(["Admin", "Manager"]), createTask);
router.get("/", getTasks);
router.put("/:id", roleMiddleware(["Admin", "Manager"]), updateTask);
router.delete("/:id", roleMiddleware(["Admin", "Manager"]), deleteTask);

module.exports = router;