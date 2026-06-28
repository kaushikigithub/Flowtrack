import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StoryCard from '../components/StoryCard';
import Button from '../components/Button';
import CreateStoryModal from '../components/CreateStoryModal';
import CreateTaskModal from '../components/CreateTaskModal';

function ProjectView() {
  const { id } = useParams(); // grabs the ":id" part of the URL, e.g. "5"
  const { isManager } = useAuth();

  const [project, setProject] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showStoryModal, setShowStoryModal] = useState(false);
  const [taskModalConfig, setTaskModalConfig] = useState(null); // { storyId, onCreated } or null

  const [users, setUsers] = useState([]);
 useEffect(() => {
  async function fetchProjectData() {
    try {
      const [projectRes, storiesRes, usersRes] = await Promise.all([
        axiosInstance.get(`/projects/${id}`),
        axiosInstance.get(`/stories/project/${id}`),
        axiosInstance.get('/users'),
      ]);
      setProject(projectRes.data);
      setStories(storiesRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError('Failed to load project.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  fetchProjectData();
}, [id]); // re-run if the :id in the URL changes (e.g. navigating between projects)

  function handleStoryCreated(newStory) {
    setStories((prev) => [newStory, ...prev]);
  }

  function handleStoryDeleted(storyId) {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
  }

  function handleAddTaskClick(storyId, onCreatedCallback) {
    setTaskModalConfig({ storyId, onCreated: onCreatedCallback });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <p className="text-red-500">{error || 'Project not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-500 mt-1">{project.description}</p>
          </div>
          {isManager && (
            <Button className="flex items-center gap-1.5" onClick={() => setShowStoryModal(true)}>
              <Plus size={16} /> New Story
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {stories.length === 0 ? (
  <div className="bg-white rounded-card border border-gray-100 p-10 text-center">
    <div className="text-4xl mb-3">📖</div>
    <p className="text-gray-600 font-medium mb-1">No user stories yet</p>
    <p className="text-gray-400 text-sm mb-4">Break this project down into stories to start tracking work.</p>
    {isManager && (
      <Button onClick={() => setShowStoryModal(true)} className="inline-flex items-center gap-1.5">
        <Plus size={16} /> Add Story
      </Button>
    )}
  </div>
) : (
            stories.map((story) => (
             <StoryCard
  key={story.id}
  story={story}
  users={users}
  onStoryDeleted={handleStoryDeleted}
  onAddTaskClick={handleAddTaskClick}
/>
            ))
          )}
        </div>
      </div>

      {showStoryModal && (
        <CreateStoryModal
          projectId={id}
          onClose={() => setShowStoryModal(false)}
          onStoryCreated={handleStoryCreated}
        />
      )}

      {taskModalConfig && (
        <CreateTaskModal
          storyId={taskModalConfig.storyId}
          onClose={() => setTaskModalConfig(null)}
          onTaskCreated={(newTask) => {
            taskModalConfig.onCreated(newTask);
            setTaskModalConfig(null);
          }}
        />
      )}
    </div>
  );
}

export default ProjectView;