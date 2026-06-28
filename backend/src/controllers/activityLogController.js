const activityLogService = require('../services/activityLogService');

async function getRecent(req, res, next) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
    const logs = await activityLogService.getRecentActivity(limit);
    res.json(logs);
  } catch (err) {
    next(err);
  }
}

module.exports = { getRecent };