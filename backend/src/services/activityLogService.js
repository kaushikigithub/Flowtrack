const activityLogRepository = require('../repositories/activityLogRepository');

// Logs an action — designed to NEVER throw, so it never breaks the main operation
async function logActivity({ userId, action, entityType, entityId, details }) {
  try {
    await activityLogRepository.create({ userId, action, entityType, entityId, details });
  } catch (err) {
    // Logging failure should never crash the actual feature (e.g. creating a task)
    console.error('⚠️ Failed to write activity log:', err.message);
  }
}

async function getRecentActivity(limit) {
  return activityLogRepository.findRecent(limit);
}

module.exports = { logActivity, getRecentActivity };