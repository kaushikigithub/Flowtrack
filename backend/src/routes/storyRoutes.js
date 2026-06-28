const express = require('express');
const { body } = require('express-validator');
const storyController = require('../controllers/storyController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/project/:projectId', storyController.getByProject);
router.get('/:id', storyController.getOne);

router.post(
  '/',
  requireRole('manager'),
  [
    body('project_id').isInt().withMessage('Valid project_id is required'),
    body('title').trim().notEmpty().withMessage('Story title is required'),
  ],
  validate,
  storyController.create
);

router.put('/:id', requireRole('manager'), storyController.update);
router.delete('/:id', requireRole('manager'), storyController.remove);

module.exports = router;