import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, ListTodo } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import KPICard from '../components/KPICard';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';

function MemberDashboard() {
  const { user } = useAuth();
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMyTasks() {
      try {
        // Fetch all projects, then all stories, then all tasks filtered to this user
        // (Simple approach for now — fetch everything and filter client-side)
        const projectsRes = await axiosInstance.get('/projects');
        const allTasks = [];

        for (const project of projectsRes.data) {
          const storiesRes = await axiosInstance.get(`/stories/project/${project.id}`);
          for (const story of storiesRes.data) {
            const tasksRes = await axiosInstance.get(`/tasks/story/${story.id}?assigneeId=${user.id}`);
            allTasks.push(...tasksRes.data.data.map((t) => ({ ...t, projectName: project.name, storyTitle: story.title })));
          }
        }

        setMyTasks(allTasks);
      } catch (err) {
        setError('Failed to load your tasks.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyTasks();
  }, [user.id]);

  async function handleStatusChange(taskId, newStatus) {
    try {
      const response = await axiosInstance.put(`/tasks/${taskId}`, { status: newStatus });
      setMyTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...response.data } : t)));
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  }

  const todoCount = myTasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = myTasks.filter((t) => t.status === 'in_progress').length;
  const doneCount = myTasks.filter((t) => t.status === 'done').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-card p-8 mb-8 text-white">
          <h1 className="text-2xl font-bold mb-1">Hey {user?.name} 👋</h1>
          <p className="text-white/80">Here's what's on your plate today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <KPICard label="To Do" value={todoCount} icon={ListTodo} accentColor="amber" />
          <KPICard label="In Progress" value={inProgressCount} icon={Clock} accentColor="accent" />
          <KPICard label="Completed" value={doneCount} icon={CheckCircle2} accentColor="emerald" />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Tasks</h2>

        {loading ? (
  <div className="space-y-3">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>
) : error ? (
          <p className="text-red-500">{error}</p>
        ) : myTasks.length === 0 ? (
  <div className="bg-white rounded-card border border-gray-100 p-10 text-center">
    <div className="text-4xl mb-3">✅</div>
    <p className="text-gray-600 font-medium mb-1">All caught up!</p>
    <p className="text-gray-400 text-sm">No tasks assigned to you right now.</p>
  </div>
) : (
          <div className="space-y-3">
            {myTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-card shadow-soft border border-gray-100 p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className={`font-medium ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {task.projectName} → {task.storyTitle}
                    {task.due_date && ` • Due ${new Date(task.due_date).toLocaleDateString()}`}
                  </p>
                </div>

                <PriorityBadge priority={task.priority} />

                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="text-xs border border-gray-200 rounded-card px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MemberDashboard;