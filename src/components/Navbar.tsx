import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white/10 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="flex items-center text-white">
              <Zap className="h-8 w-8 text-purple-400" />
              <span className="ml-2 text-xl font-bold">Vigo Fusion</span>
            </Link>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            {location.pathname !== '/' && (
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                <Home className="h-5 w-5" />
              </Link>
            )}
            {user ? (
              <>
                <Link to="/feed" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Feed
                </Link>
                <Link to="/chat" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Chat
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}