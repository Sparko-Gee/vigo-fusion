import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Feed from './pages/Feed';
import Chat from './pages/Chat';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen relative">
          {/* Dynamic Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-0"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            {/* Interactive particles effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          </motion.div>
          <div className="relative z-10">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}