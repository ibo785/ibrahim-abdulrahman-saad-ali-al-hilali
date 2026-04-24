import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, logout } from '../services/authService';
import { LogIn, LogOut, PlusCircle, User, Coins, Home, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function Header() {
  const { user, profile } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-200">
                E
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight hidden sm:block">Echo Share</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors flex items-center gap-1">
                <Home size={18} /> Browse
              </Link>
              <Link to="/search" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors flex items-center gap-1">
                <Search size={18} /> Search
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                  <Coins size={16} className="text-amber-500" />
                  <span className="text-sm font-bold text-amber-700">{profile?.points || 0} pts</span>
                </div>
                
                <Link to="/upload">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full font-medium shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-colors"
                  >
                    <PlusCircle size={18} />
                    <span className="hidden sm:inline">Share Item</span>
                  </motion.button>
                </Link>

                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-8 h-8 rounded-full border border-gray-200" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <User size={18} />
                    </div>
                  )}
                </Link>

                <button 
                  onClick={logout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
              >
                <LogIn size={18} />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
