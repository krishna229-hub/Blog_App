import React, { useEffect, useState } from "react";
import { useAuth } from "../store/authStore";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { API_URL } from "../config.js";
import toast from "react-hot-toast";
import { loadingClass, errorClass, primaryBtn, secondaryBtn } from "../styles/common";

const AuthorDashboard = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = useAuth((state) => state.currentUser);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/author-api/articles`,
          { withCredentials: true }
        );
        setArticles(res.data.payload);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Derived stats
  const totalArticles = articles.length;
  const activeArticles = articles.filter((a) => a.isArticleActive).length;
  const deletedArticles = totalArticles - activeArticles;
  const totalComments = articles.reduce(
    (sum, a) => sum + (a.comments?.length || 0),
    0
  );
  const categories = [...new Set(articles.map((a) => a.category))];
  const recentArticles = articles.slice(0, 5);

  // Most commented article
  const mostCommented = articles.length > 0
    ? articles.reduce((prev, curr) =>
        (curr.comments?.length || 0) > (prev.comments?.length || 0) ? curr : prev
      )
    : null;

  if (loading) return <p className={loadingClass}>Loading dashboard...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* ── Welcome Header ─────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover border-2 border-[#d2d2d7]"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#0066cc] flex items-center justify-center text-2xl font-bold text-white">
              {currentUser?.firstName?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
              Welcome back, {currentUser?.firstName}!
            </h1>
            <p className="text-sm text-[#6e6e73]">Here's your author dashboard</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/add-article" className={primaryBtn}>
            + New Article
          </Link>
          <Link to="/author-profile" className={secondaryBtn}>
            My Profile
          </Link>
        </div>
      </div>

      {/* ── Stats Cards ────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#f5f5f7] rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-[#1d1d1f]">{totalArticles}</p>
          <p className="text-xs text-[#6e6e73] mt-1">Total Articles</p>
        </div>
        <div className="bg-[#f5f5f7] rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-[#34c759]">{activeArticles}</p>
          <p className="text-xs text-[#6e6e73] mt-1">Active</p>
        </div>
        <div className="bg-[#f5f5f7] rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-[#ff3b30]">{deletedArticles}</p>
          <p className="text-xs text-[#6e6e73] mt-1">Deleted</p>
        </div>
        <div className="bg-[#f5f5f7] rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-[#ff9500]">{totalComments}</p>
          <p className="text-xs text-[#6e6e73] mt-1">Total Comments</p>
        </div>
      </div>

      {/* ── Quick Actions ──────────────────────────── */}
      <div className="bg-[#f5f5f7] rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-[#1d1d1f] tracking-tight mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/add-article"
            className="bg-white border border-[#d2d2d7] text-[#1d1d1f] text-sm px-4 py-2.5 rounded-xl hover:bg-[#ebebf0] transition-colors"
          >
            ✍️ Write New Article
          </Link>
          <Link
            to="/author-profile"
            className="bg-white border border-[#d2d2d7] text-[#1d1d1f] text-sm px-4 py-2.5 rounded-xl hover:bg-[#ebebf0] transition-colors"
          >
            📝 Manage Articles
          </Link>
          <Link
            to="/"
            className="bg-white border border-[#d2d2d7] text-[#1d1d1f] text-sm px-4 py-2.5 rounded-xl hover:bg-[#ebebf0] transition-colors"
          >
            🏠 Home Page
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* ── Categories Breakdown ───────────────────── */}
        <div className="bg-[#f5f5f7] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-[#1d1d1f] tracking-tight mb-4">
            Categories
          </h2>
          {categories.length === 0 ? (
            <p className="text-sm text-[#a1a1a6]">No categories yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {categories.map((cat) => {
                const count = articles.filter((a) => a.category === cat).length;
                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5"
                  >
                    <span className="text-sm font-medium text-[#1d1d1f]">
                      {cat}
                    </span>
                    <span className="text-xs font-semibold text-[#0066cc] bg-[#0066cc]/10 px-2 py-0.5 rounded-full">
                      {count} {count === 1 ? "article" : "articles"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Most Commented ─────────────────────────── */}
        <div className="bg-[#f5f5f7] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-[#1d1d1f] tracking-tight mb-4">
            Most Commented Article
          </h2>
          {mostCommented && (mostCommented.comments?.length || 0) > 0 ? (
            <div
              onClick={() =>
                navigate(`/article/${mostCommented._id}`, {
                  state: { articleObj: mostCommented },
                })
              }
              className="bg-white rounded-xl p-4 cursor-pointer hover:bg-[#ebebf0] transition-colors"
            >
              <span className="text-[0.6rem] font-semibold text-[#0066cc] uppercase tracking-widest">
                {mostCommented.category}
              </span>
              <h3 className="text-sm font-semibold text-[#1d1d1f] mt-1">
                {mostCommented.title}
              </h3>
              <p className="text-xs text-[#6e6e73] mt-1">
                {mostCommented.content.substring(0, 80)}...
              </p>
              <p className="text-xs text-[#ff9500] font-semibold mt-2">
                💬 {mostCommented.comments?.length} comments
              </p>
            </div>
          ) : (
            <p className="text-sm text-[#a1a1a6]">
              No comments on any articles yet.
            </p>
          )}
        </div>
      </div>

      {/* ── Recent Articles ────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1d1d1f] tracking-tight">
            Recent Articles
          </h2>
          <Link
            to="/author-profile"
            className="text-sm text-[#0066cc] hover:text-[#004499] transition-colors font-medium"
          >
            View all →
          </Link>
        </div>

        {recentArticles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-[#a1a1a6] mb-4">
              You haven't written any articles yet.
            </p>
            <Link to="/add-article" className={primaryBtn}>
              Write Your First Article
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentArticles.map((article) => (
              <div
                key={article._id}
                className="bg-[#f5f5f7] rounded-xl p-4 flex items-center gap-4 hover:bg-[#ebebf0] transition-colors duration-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[0.6rem] font-semibold text-[#0066cc] uppercase tracking-widest">
                      {article.category}
                    </span>
                    <span className="text-[0.6rem] text-[#a1a1a6]">·</span>
                    <span className="text-[0.6rem] text-[#a1a1a6]">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                        article.isArticleActive
                          ? "bg-[#34c759]/20 text-[#248a3d]"
                          : "bg-[#ff3b30]/20 text-[#cc2f26]"
                      }`}
                    >
                      {article.isArticleActive ? "Active" : "Deleted"}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#1d1d1f] truncate">
                    {article.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-[#a1a1a6]">
                    💬 {article.comments?.length || 0}
                  </span>
                  <button
                    onClick={() =>
                      navigate("/edit-article", { state: article })
                    }
                    className="text-xs text-[#0066cc] font-medium hover:text-[#004499] transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/article/${article._id}`, {
                        state: { articleObj: article },
                      })
                    }
                    className="text-xs text-[#6e6e73] font-medium hover:text-[#1d1d1f] transition-colors cursor-pointer"
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorDashboard;