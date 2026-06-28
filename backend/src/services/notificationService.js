const notificationRepository = require('../repositories/notificationRepository');

async function getMyNotifications(userId) {
  return notificationRepository.findByUserId(userId);
}

async function markNotificationRead(id, userId) {
  const updated = await notificationRepository.markAsRead(id, userId);
  if (!updated) {
    const error = new Error('Notification not found');
    error.statusCode = 404;
    throw error;
  }
  return updated;
}

module.exports = { getMyNotifications, markNotificationRead };