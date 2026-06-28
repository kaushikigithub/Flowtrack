const projectService = require('../services/projectService');
const activityLogService = require('../services/activityLogService');

async function getAll(req, res, next) {
  try {
    const projects = await projectService.getAllProjects();
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.json(project);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, description } = req.body;
    const createdBy = req.user.id;
    const project = await projectService.createProject({ name, description, createdBy });

    await activityLogService.logActivity({
      userId: req.user.id,
      action: 'created',
      entityType: 'project',
      entityId: project.id,
      details: `Created project "${project.name}"`,
    });

    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { name, description, status } = req.body;
    const project = await projectService.updateProject(req.params.id, { name, description, status });

    await activityLogService.logActivity({
      userId: req.user.id,
      action: 'updated',
      entityType: 'project',
      entityId: project.id,
      details: `Updated project "${project.name}"`,
    });

    res.json(project);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const projectId = req.params.id;
    await projectService.deleteProject(projectId);

    await activityLogService.logActivity({
      userId: req.user.id,
      action: 'deleted',
      entityType: 'project',
      entityId: projectId,
      details: `Deleted project #${projectId}`,
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, update, remove };