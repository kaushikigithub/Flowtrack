const express = require('express');
const activityLogController = require('../controllers/activityLogController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Only managers can view the full team activity log
router.get('/', requireRole('manager'), activityLogController.getRecent);

module.exports = router;