import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import TaskItem from './TaskItem';
import Button from './Button';

function StoryCard({ story, users, onStoryDeleted, onAddTaskClick }) {
  const { isManager } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);

  async function toggleExpand() {
    if (!expanded && !tasksLoaded) {
      try {
        const response = await axiosInstance.get(`/tasks/story/${story.id}`);
        setTasks(response.data.data); // .data.data because of our pagination wrapper
        setTasksLoaded(true);
      } catch (err) {
        console.error('Failed to load tasks:', err);
      }
    }
    setExpanded(!expanded);
  }

  function handleTaskUpdated(updatedTask) {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  }

  function handleTaskDeleted(taskId) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  function handleTaskCreated(newTask) {
    setTasks((prev) => [newTask, ...prev]);
  }

  async function handleDeleteStory() {
    if (!confirm('Delete this story and all its tasks?')) return;
    try {
      await axiosInstance.delete(`/stories/${story.id}`);
      onStoryDeleted(story.id);
    } catch (err) {
      console.error('Failed to delete story:', err);
    }
  }

  return (
    <div className="bg-white rounded-card shadow-soft border border-gray-100 overflow-hidden animate-fade-in">
      <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={toggleExpand}>
        <button className="text-gray-400">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{story.title}</h3>
          {story.description && <p className="text-sm text-gray-400 mt-0.5">{story.description}</p>}
        </div>

        <PriorityBadge priority={story.priority} />
        <StatusBadge status={story.status} />

        {isManager && (
          <button
            onClick={(e) => { e.stopPropagation(); handleDeleteStory(); }}
            className="text-gray-300 hover:text-red-500 transition"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-2 bg-gray-50/50">
          {tasks.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">No tasks yet.</p>
          ) : (
            tasks.map((task) => (
              <TaskItem
  key={task.id}
  task={task}
  users={users}
  onTaskUpdated={handleTaskUpdated}
  onTaskDeleted={handleTaskDeleted}
/>
            ))
          )}

          {isManager && (
            <Button
              variant="secondary"
              className="flex items-center gap-1.5 text-sm mt-2"
              onClick={() => onAddTaskClick(story.id, handleTaskCreated)}
            >
              <Plus size={14} /> Add Task
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default StoryCard;