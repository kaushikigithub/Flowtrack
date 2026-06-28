const express = require('express');
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

// All project routes require login
router.use(authMiddleware);

router.get('/', projectController.getAll);
router.get('/:id', projectController.getOne);

router.post(
  '/',
  requireRole('manager'),
  [body('name').trim().notEmpty().withMessage('Project name is required')],
  validate,
  projectController.create
);

router.put(
  '/:id',
  requireRole('manager'),
  projectController.update
);

router.delete(
  '/:id',
  requireRole('manager'),
  projectController.remove
);

module.exports = router;