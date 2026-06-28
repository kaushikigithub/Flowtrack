const projectRepository = require('../repositories/projectRepository');

async function getAllProjects() {
  return projectRepository.findAll();
}

async function getProjectById(id) {
  const project = await projectRepository.findById(id);
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  return project;
}

async function createProject({ name, description, createdBy }) {
  return projectRepository.create({ name, description, createdBy });
}

async function updateProject(id, updates) {
  await getProjectById(id); // throws 404 if it doesn't exist
  return projectRepository.update(id, updates);
}

async function deleteProject(id) {
  const deleted = await projectRepository.remove(id);
  if (!deleted) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  return deleted;
}

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject };