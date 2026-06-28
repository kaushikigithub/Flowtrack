const taskRepository = require('../repositories/taskRepository');
const storyRepository = require('../repositories/storyRepository');

async function getTasksByStory(storyId, queryParams) {
  const story = await storyRepository.findById(storyId);
  if (!story) {
    const error = new Error('Story not found');
    error.statusCode = 404;
    throw error;
  }
  return taskRepository.findByStoryId(storyId, queryParams);
}

async function getTaskById(id) {
  const task = await taskRepository.findById(id);
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }
  return task;
}

async function createTask({ storyId, title, description, assigneeId, priority, dueDate }) {
  const story = await storyRepository.findById(storyId);
  if (!story) {
    const error = new Error('Cannot create task: story not found');
    error.statusCode = 404;
    throw error;
  }
  return taskRepository.create({ storyId, title, description, assigneeId, priority, dueDate });
}

async function updateTask(id, updates) {
  await getTaskById(id);
  return taskRepository.update(id, updates);
}

async function deleteTask(id) {
  const deleted = await taskRepository.softDelete(id);
  if (!deleted) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }
  return deleted;
}

module.exports = { getTasksByStory, getTaskById, createTask, updateTask, deleteTask };