import { useState } from 'react';
import { Calendar, User, Trash2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import PriorityBadge from './PriorityBadge';

function TaskItem({ task, users, onTaskUpdated, onTaskDeleted }) {
  const { isManager } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      const response = await axiosInstance.put(`/tasks/${task.id}`, { status: newStatus });
      onTaskUpdated(response.data);
    } catch (err) {
      console.error('Failed to update task:', err);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this task?')) return;
    try {
      await axiosInstance.delete(`/tasks/${task.id}`);
      onTaskDeleted(task.id);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-card">
      <div className="flex-1">
        <p className={`text-sm font-medium ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-3 mt-1">
          {task.due_date && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar size={12} /> {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
         {task.assignee_id && (
  <span className="flex items-center gap-1.5 text-xs text-gray-400">
    <Avatar name={users?.find((u) => u.id === task.assignee_id)?.name} size="sm" />
    {users?.find((u) => u.id === task.assignee_id)?.name || 'Assigned'}
  </span>
)}
        </div>
      </div>

      <PriorityBadge priority={task.priority} />

      <select
        value={task.status}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className="text-xs border border-gray-200 rounded-card px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {isManager && (
        <button onClick={handleDelete} className="text-gray-300 hover:text-red-500 transition">
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}

export default TaskItem;