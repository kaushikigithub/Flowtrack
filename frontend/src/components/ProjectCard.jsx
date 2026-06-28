import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

function ProjectCard({ project }) {
  const [progress, setProgress] = useState(null);

  const statusStyles = {
    active: 'bg-emerald-50 text-emerald-600',
    archived: 'bg-gray-100 text-gray-500',
  };

  useEffect(() => {
    async function fetchProgress() {
      try {
        const storiesRes = await axiosInstance.get(`/stories/project/${project.id}`);
        let total = 0;
        let done = 0;

        for (const story of storiesRes.data) {
          const tasksRes = await axiosInstance.get(`/tasks/story/${story.id}?limit=100`);
          total += tasksRes.data.pagination.totalCount;
          done += tasksRes.data.data.filter((t) => t.status === 'done').length;
        }

        setProgress(total === 0 ? 0 : Math.round((done / total) * 100));
      } catch (err) {
        console.error('Failed to load progress:', err);
        setProgress(0);
      }
    }
    fetchProgress();
  }, [project.id]);

  return (
    <Link
      to={`/projects/${project.id}`}
      className="bg-white rounded-card shadow-soft border border-gray-100 p-5 hover:shadow-soft-lg hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-200 block animate-fade-in"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-card bg-primary-50 text-primary-600">
          <FolderKanban size={18} />
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[project.status]}`}>
          {project.status}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{project.description || 'No description'}</p>

      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
        <span>Progress</span>
        <span>{progress === null ? '...' : `${progress}%`}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress || 0}%` }}
        />
      </div>
    </Link>
  );
}

export default ProjectCard;