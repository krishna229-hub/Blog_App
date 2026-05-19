import React, { useEffect, useState } from "react";
import { useAuth } from "../store/authStore";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import {
  loadingClass,
  errorClass,
  primaryBtn,
  secondaryBtn,
  ghostBtn,
} from "../styles/common";

const AuthorProfile = () => {
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

  // Fetch author's articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/author-api/articles",
          { withCredentials: true }
        );
        setArticles(res.data.payload);
        toast.success("Articles loaded");
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load articles");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Toggle article status (soft delete / restore)
  const toggleArticleStatus = async (articleId) => {
    try {
      const res = await axios.patch(
        `http://localhost:4000/author-api/article/${articleId}/status`,
        {},
        { withCredentials: true }
      );
      setArticles((prev) =>
        prev.map((a) =>
          a._id === articleId
            ? { ...a, isArticleActive: res.data.payload.isArticleActive }
            : a
        )
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Failed to update article status");
    }
  };

  // Navigate to edit article
  const handleEdit = (article) => {
    navigate("/edit-article", { state: article });
  };

  // Stats
  const totalArticles = articles.length;
  const activeArticles = articles.filter((a) => a.isArticleActive).length;
  const totalComments = articles.reduce(
    (sum, a) => sum + (a.comments?.length || 0),
    0
  );

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
            Author
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link to="/add-article" className={primaryBtn}>
            + New Article
          </Link>
          <button onClick={onLogout} className={secondaryBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#f5f5f7] rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[#1d1d1f]">{totalArticles}</p>
          <p className="text-sm text-[#6e6e73]">Total Articles</p>
        </div>
        <div className="bg-[#f5f5f7] rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[#34c759]">{activeArticles}</p>
          <p className="text-sm text-[#6e6e73]">Active</p>
        </div>
        <div className="bg-[#f5f5f7] rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[#ff9500]">{totalComments}</p>
          <p className="text-sm text-[#6e6e73]">Comments</p>
        </div>
      </div>

      {/* ── My Articles ────────────────────────────────── */}
      <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight mb-4">
        My Articles
      </h2>

      {articles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-[#a1a1a6] text-lg mb-4">No articles yet</p>
          <Link to="/add-article" className={primaryBtn}>
            Write Your First Article
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((article) => (
            <div
              key={article._id}
              className="bg-[#f5f5f7] rounded-2xl p-5 flex flex-col gap-2.5 hover:bg-[#ebebf0] transition-colors duration-200"
            >
              {/* Status & Category */}
              <div className="flex justify-between items-center">
                <span className="text-[0.65rem] font-semibold text-[#0066cc] uppercase tracking-widest">
                  {article.category}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                    article.isArticleActive
                      ? "bg-[#34c759]/20 text-[#248a3d]"
                      : "bg-[#ff3b30]/20 text-[#cc2f26]"
                  }`}
                >
                  {article.isArticleActive ? "Active" : "Deleted"}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold text-[#1d1d1f] leading-snug tracking-tight">
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="text-sm text-[#6e6e73] leading-relaxed">
                {article.content.substring(0, 80)}
                {article.content.length > 80 ? "..." : ""}
              </p>

              {/* Meta */}
              <p className="text-xs text-[#a1a1a6]">
                {new Date(article.createdAt).toLocaleDateString()} ·{" "}
                💬 {article.comments?.length || 0} comments
              </p>

              {/* Actions */}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => handleEdit(article)}
                  className="bg-[#0066cc] text-white text-xs px-3 py-1.5 rounded-full hover:bg-[#004499] transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleArticleStatus(article._id)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                    article.isArticleActive
                      ? "bg-[#ff3b30] text-white hover:bg-[#d62c23]"
                      : "bg-[#34c759] text-white hover:bg-[#248a3d]"
                  }`}
                >
                  {article.isArticleActive ? "Delete" : "Restore"}
                </button>
                <button
                  onClick={() =>
                    navigate(`/article/${article._id}`, {
                      state: { articleObj: article },
                    })
                  }
                  className="text-[#0066cc] text-xs font-medium cursor-pointer ml-auto hover:text-[#004499] transition-colors"
                >
                  View →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorProfile;