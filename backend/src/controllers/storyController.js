const storyService = require('../services/storyService');

async function getByProject(req, res, next) {
  try {
    const stories = await storyService.getStoriesByProject(req.params.projectId);
    res.json(stories);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const story = await storyService.getStoryById(req.params.id);
    res.json(story);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { project_id, title, description, priority } = req.body;
    const story = await storyService.createStory({ projectId: project_id, title, description, priority });
    res.status(201).json(story);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { title, description, priority, status } = req.body;
    const story = await storyService.updateStory(req.params.id, { title, description, priority, status });
    res.json(story);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await storyService.deleteStory(req.params.id);
    res.json({ message: 'Story deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getByProject, getOne, create, update, remove };