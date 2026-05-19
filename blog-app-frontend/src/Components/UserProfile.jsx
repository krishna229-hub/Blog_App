import React, { useEffect, useState } from 'react'
import { useAuth } from '../store/authStore'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import axios from 'axios'
import { API_URL } from '../config.js'
import Card from './Card'
import {
  loadingClass,
  errorClass,
  primaryBtn,
  secondaryBtn,
  articleGrid,
} from '../styles/common'

const UserProfile = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);

  const onLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  // Fetch all articles for the user to read
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/user-api/articles`,
          { withCredentials: true }
        );
        setArticles(res.data.payload);
        toast.success('Articles loaded');
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load articles');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Stats
  const totalArticles = articles.length;
  const totalComments = articles.reduce(
    (sum, a) => sum + (a.comments?.length || 0),
    0
  );
  const categories = [...new Set(articles.map((a) => a.category))].length;

  if (loading) return <p className={loadingClass}>Loading...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  return (
    <div className="p-5">
      {/* ── Profile Header ─────────────────────────────── */}
      <div className="bg-[#f5f5f7] rounded-2xl p-5 md:p-8 flex flex-col md:flex-row items-center gap-5 mb-6">
        {/* Avatar */}
        {currentUser?.profileImageUrl ? (
          <img
            src={currentUser.profileImageUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#d2d2d7]"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-[#0066cc] flex items-center justify-center text-3xl font-bold text-white">
            {currentUser?.firstName?.charAt(0)?.toUpperCase()}
          </div>
        )}

        {/* Info */}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
            {currentUser?.firstName} {currentUser?.lastName}
          </h1>
          <p className="text-[#6e6e73]">{currentUser?.email}</p>
          <span className="inline-block mt-1 text-xs font-semibold text-[#0066cc] bg-[#0066cc]/10 px-2.5 py-0.5 rounded-full">
            User
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className={secondaryBtn}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#f5f5f7] rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[#1d1d1f]">{totalArticles}</p>
          <p className="text-sm text-[#6e6e73]">Articles Available</p>
        </div>
        <div className="bg-[#f5f5f7] rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[#34c759]">{categories}</p>
          <p className="text-sm text-[#6e6e73]">Categories</p>
        </div>
        <div className="bg-[#f5f5f7] rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[#ff9500]">{totalComments}</p>
          <p className="text-sm text-[#6e6e73]">Comments</p>
        </div>
      </div>

      {/* ── Articles ───────────────────────────────────── */}
      <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight mb-4">
        All Articles
      </h2>

      {articles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-[#a1a1a6] text-lg mb-4">No articles available yet</p>
        </div>
      ) : (
        <div className={articleGrid}>
          {articles.map((articleObj) => (
            <Card key={articleObj._id} articleObj={articleObj} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;