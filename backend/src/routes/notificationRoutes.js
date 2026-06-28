console.log("✅ notificationRoutes loaded");
const express = require('express');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { runReminderCheck } = require('../jobs/reminderJob');

const router = express.Router();

router.use(authMiddleware);

router.get('/', notificationController.getMine);
router.put('/:id/read', notificationController.markRead);

// Manual trigger for testing the reminder job on-demand (manager only)
router.post('/trigger-reminder-check', requireRole('manager'), async (req, res, next) => {
  try {
    await runReminderCheck();
    res.json({ message: 'Reminder check triggered manually' });
  } catch (err) {
    next(err);
  }
});
console.log("✅ Trigger reminder route registered");
module.exports = router;