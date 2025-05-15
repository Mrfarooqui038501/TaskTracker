const User = require("../model/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username email role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};