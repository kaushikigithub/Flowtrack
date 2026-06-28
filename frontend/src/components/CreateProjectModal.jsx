import { motion } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import Button from './Button';

function CreateProjectModal({ onClose, onProjectCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post('/projects', { name, description });
      onProjectCreated(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      className="bg-white rounded-card shadow-soft-lg w-full max-w-md p-6"
    >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">New Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-card px-4 py-3 mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-2.5 border border-gray-200 rounded-card focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g. Website Redesign"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-card focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="What is this project about?"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
      </form>
    </motion.div>
  </motion.div>
);
}

export default CreateProjectModal;
