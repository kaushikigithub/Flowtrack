const storyRepository = require('../repositories/storyRepository');
const projectRepository = require('../repositories/projectRepository');

async function getStoriesByProject(projectId) {
  const project = await projectRepository.findById(projectId);
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  return storyRepository.findByProjectId(projectId);
}

async function getStoryById(id) {
  const story = await storyRepository.findById(id);
  if (!story) {
    const error = new Error('Story not found');
    error.statusCode = 404;
    throw error;
  }
  return story;
}

async function createStory({ projectId, title, description, priority }) {
  const project = await projectRepository.findById(projectId);
  if (!project) {
    const error = new Error('Cannot create story: project not found');
    error.statusCode = 404;
    throw error;
  }
  return storyRepository.create({ projectId, title, description, priority });
}

async function updateStory(id, updates) {
  await getStoryById(id);
  return storyRepository.update(id, updates);
}

async function deleteStory(id) {
  const deleted = await storyRepository.remove(id);
  if (!deleted) {
    const error = new Error('Story not found');
    error.statusCode = 404;
    throw error;
  }
  return deleted;
}

module.exports = { getStoriesByProject, getStoryById, createStory, updateStory, deleteStory };