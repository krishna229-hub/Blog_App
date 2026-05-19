import React, { useEffect, useState } from "react";
import { useAuth } from "../store/authStore";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { loadingClass, errorClass, primaryBtn, secondaryBtn } from "../styles/common";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);

  const onLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/user-api/articles",
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
  const totalComments = articles.reduce(
    (sum, a) => sum + (a.comments?.length || 0),
    0
  );
  const categories = [...new Set(articles.map((a) => a.category))];
  const recentArticles = articles.slice(0, 4);

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
            <p className="text-sm text-[#6e6e73]">Here's your reading overview</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/user-profile" className={primaryBtn}>
            My Profile
          </Link>
          <button onClick={onLogout} className={secondaryBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* ── Stats Cards ────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#f5f5f7] rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-[#1d1d1f]">{totalArticles}</p>
          <p className="text-xs text-[#6e6e73] mt-1">Articles Available</p>
        </div>
        <div className="bg-[#f5f5f7] rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-[#0066cc]">{categories.length}</p>
          <p className="text-xs text-[#6e6e73] mt-1">Categories</p>
        </div>
        <div className="bg-[#f5f5f7] rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-[#ff9500]">{totalComments}</p>
          <p className="text-xs text-[#6e6e73] mt-1">Total Comments</p>
        </div>
        <div className="bg-[#f5f5f7] rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-[#34c759]">{recentArticles.length}</p>
          <p className="text-xs text-[#6e6e73] mt-1">Recent Articles</p>
        </div>
      </div>

      {/* ── Quick Actions ──────────────────────────── */}
      <div className="bg-[#f5f5f7] rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-[#1d1d1f] tracking-tight mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/user-profile"
            className="bg-white border border-[#d2d2d7] text-[#1d1d1f] text-sm px-4 py-2.5 rounded-xl hover:bg-[#ebebf0] transition-colors"
          >
            📖 Browse All Articles
          </Link>
          <Link
            to="/"
            className="bg-white border border-[#d2d2d7] text-[#1d1d1f] text-sm px-4 py-2.5 rounded-xl hover:bg-[#ebebf0] transition-colors"
          >
            🏠 Home Page
          </Link>
        </div>
      </div>

      {/* ── Categories Overview ────────────────────── */}
      {categories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#1d1d1f] tracking-tight mb-4">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="text-xs font-semibold text-[#0066cc] bg-[#0066cc]/10 px-3 py-1.5 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Recent Articles ────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1d1d1f] tracking-tight">
            Recent Articles
          </h2>
          <Link
            to="/user-profile"
            className="text-sm text-[#0066cc] hover:text-[#004499] transition-colors font-medium"
          >
            View all →
          </Link>
        </div>

        {recentArticles.length === 0 ? (
          <p className="text-sm text-[#a1a1a6] py-6 text-center">
            No articles available yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {recentArticles.map((article) => (
              <div
                key={article._id}
                onClick={() =>
                  navigate(`/article/${article._id}`, {
                    state: { articleObj: article },
                  })
                }
                className="bg-[#f5f5f7] rounded-xl p-4 flex items-center gap-4 hover:bg-[#ebebf0] transition-colors duration-200 cursor-pointer"
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
                  </div>
                  <h3 className="text-sm font-semibold text-[#1d1d1f] truncate">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#6e6e73] mt-0.5 truncate">
                    {article.content.substring(0, 100)}
                  </p>
                </div>
                <div className="text-xs text-[#a1a1a6] shrink-0">
                  💬 {article.comments?.length || 0}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;