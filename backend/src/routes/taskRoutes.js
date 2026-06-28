const express = require('express');
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(authMiddleware);

// GET /api/tasks/story/5?page=1&limit=20&status=todo&priority=high
router.get('/story/:storyId', taskController.getByStory);
router.get('/:id', taskController.getOne);

router.post(
  '/',
  requireRole('manager'),
  [
    body('story_id').isInt().withMessage('Valid story_id is required'),
    body('title').trim().notEmpty().withMessage('Task title is required'),
  ],
  validate,
  taskController.create
);

// Both managers AND members can update tasks (e.g., a member marking their task as done)
router.put('/:id', taskController.update);

router.delete('/:id', requireRole('manager'), taskController.remove);

module.exports = router;