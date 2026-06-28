const taskService = require('../services/taskService');
const activityLogService = require('../services/activityLogService');

async function getByStory(req, res, next) {
  try {
    const { page, limit, status, priority, assigneeId } = req.query;
    const result = await taskService.getTasksByStory(req.params.storyId, {
      page, limit, status, priority, assigneeId,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { story_id, title, description, assignee_id, priority, due_date } = req.body;
    const task = await taskService.createTask({
      storyId: story_id,
      title,
      description,
      assigneeId: assignee_id,
      priority,
      dueDate: due_date,
    });

    await activityLogService.logActivity({
      userId: req.user.id,
      action: 'created',
      entityType: 'task',
      entityId: task.id,
      details: `Created task "${task.title}"`,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { title, description, assignee_id, status, priority, due_date } = req.body;
    const task = await taskService.updateTask(req.params.id, {
      title, description, assigneeId: assignee_id, status, priority, dueDate: due_date,
    });

    await activityLogService.logActivity({
      userId: req.user.id,
      action: 'updated',
      entityType: 'task',
      entityId: task.id,
      details: `Updated task "${task.title}"${status ? ` → status: ${status}` : ''}`,
    });

    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const taskId = req.params.id;
    await taskService.deleteTask(taskId);

    await activityLogService.logActivity({
      userId: req.user.id,
      action: 'deleted',
      entityType: 'task',
      entityId: taskId,
      details: `Deleted task #${taskId}`,
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getByStory, getOne, create, update, remove };