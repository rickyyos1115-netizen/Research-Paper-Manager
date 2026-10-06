import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Library, PlusCircle, LogOut } from 'lucide-react';

export default function Navbar({ onLogout }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary-700 text-white' : 'text-primary-100 hover:bg-primary-600 hover:text-white';
  };

  return (
    <nav className="bg-primary-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <BookOpen className="h-8 w-8 text-white mr-2" />
              <span className="font-bold text-xl text-white">Research Manager</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
              <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive('/dashboard')}`}>
                <LayoutDashboard className="h-4 w-4 mr-1" /> Dashboard
              </Link>
              <Link to="/papers" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive('/papers')}`}>
                <Library className="h-4 w-4 mr-1" /> Papers
              </Link>
              <Link to="/papers/new" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive('/papers/new')}`}>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Paper
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <span className="text-white mr-4 text-sm font-medium">{user.name}</span>
            <button
              onClick={onLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-primary-100 hover:bg-primary-700 hover:text-white flex items-center"
            >
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
