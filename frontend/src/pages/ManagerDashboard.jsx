import Tooltip from '../components/Tooltip';
import SkeletonCard from '../components/SkeletonCard';
import { useState, useEffect } from 'react';
import { FolderKanban, ListTodo, CheckCircle2, Users, Plus } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import KPICard from '../components/KPICard';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/Button';
import CreateProjectModal from '../components/CreateProjectModal';

function ManagerDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [projectsRes, activityRes] = await Promise.all([
          axiosInstance.get('/projects'),
          axiosInstance.get('/activity-log?limit=5'),
        ]);

        setProjects(projectsRes.data);
        setActivityLog(activityRes.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  function handleProjectCreated(newProject) {
    setProjects((prev) => [newProject, ...prev]);
  }

  const activeProjects = projects.filter((p) => p.status === 'active').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-card p-8 mb-8 text-white">
          <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name} 👋</h1>
          <p className="text-white/80">Here's what's happening across your team today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard label="Total Projects" value={projects.length} icon={FolderKanban} accentColor="primary" />
          <KPICard label="Active Projects" value={activeProjects} icon={ListTodo} accentColor="accent" />
          <KPICard label="Completed Tasks" value="—" icon={CheckCircle2} accentColor="emerald" />
          <KPICard label="Team Members" value="—" icon={Users} accentColor="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Projects</h2>
              <Button variant="primary" className="flex items-center gap-1.5" onClick={() => setShowCreateModal(true)}>
                <Plus size={16} /> New Project
              </Button>
            </div>

            {loading ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>
) : error ? (
              <p className="text-red-500">{error}</p>
            ) : projects.length === 0 ? (
  <div className="bg-white rounded-card border border-gray-100 p-10 text-center">
    <div className="text-4xl mb-3">📂</div>
    <p className="text-gray-600 font-medium mb-1">No projects yet</p>
    <p className="text-gray-400 text-sm mb-4">Create your first project and start collaborating with your team.</p>
    <Button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-1.5">
      <Plus size={16} /> Create Project
    </Button>
  </div>
) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-card border border-gray-100 p-4 space-y-3">
              {activityLog.length === 0 ? (
                <p className="text-gray-400 text-sm">No activity yet.</p>
              ) : (
                activityLog.map((log) => (
                  <div key={log.id} className="text-sm border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                    <p className="text-gray-700">
                      <span className="font-medium">{log.user_name || 'Someone'}</span> {log.action} {log.entity_type}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
}

export default ManagerDashboard;