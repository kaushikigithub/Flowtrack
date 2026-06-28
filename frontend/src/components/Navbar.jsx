import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';
import Avatar from './Avatar';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-card bg-gradient-to-br from-primary-500 to-accent-500" />
        <span className="text-lg font-bold text-gray-900">FlowTrack</span>
      </div>

      <div className="flex items-center gap-4">
        <NotificationPanel />

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
          <Avatar name={user?.name} size="md" />
          <button
            onClick={logout}
            className="p-2 rounded-card hover:bg-gray-50 transition text-gray-500"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;