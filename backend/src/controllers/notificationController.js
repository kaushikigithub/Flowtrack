const notificationService = require('../services/notificationService');

async function getMine(req, res, next) {
  try {
    const notifications = await notificationService.getMyNotifications(req.user.id);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    const notification = await notificationService.markNotificationRead(req.params.id, req.user.id);
    res.json(notification);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMine, markRead };