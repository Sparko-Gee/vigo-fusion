import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';
import HomeFeed from '../components/HomeFeed';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Welcome to Vigo Fusion
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Connect, share, and engage with people around the world. Join our community today!
        </p>
        <Link
          to="/auth"
          className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Get Started
        </Link>
      </motion.div>

      <HomeFeed />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Follow Us</h2>
        <div className="flex justify-center space-x-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Facebook className="h-8 w-8" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Twitter className="h-8 w-8" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Youtube className="h-8 w-8" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Instagram className="h-8 w-8" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}