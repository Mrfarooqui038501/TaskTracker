const AuditLog = require("../model/AuditLog");

exports.logAction = async (userId, taskId, action, details) => {
  const log = new AuditLog({ userId, taskId, action, details });
  await log.save();
};