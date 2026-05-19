import axios from "axios";
import { API_URL } from "../config.js";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { useAuth } from "../store/authStore";
import toast from "react-hot-toast";
import {
  errorClass,
  loadingClass,
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  primaryBtn,
  secondaryBtn,
  inputClass,
} from "../styles/common";

const Article = () => {
  const { id } = useParams();
  const locationObj = useLocation();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const currentUser = useAuth((state) => state.currentUser);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  // Fetch article from API (always fetch fresh to get populated comments)
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const resObj = await axios.get(
          `${API_URL}/common-api/articles/${id}`
        );
        setArticle(resObj.data.payload);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  // Add comment (USER role only)
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const res = await axios.put(
        `${API_URL}/user-api/articles`,
        { articleId: id, comment: commentText },
        { withCredentials: true }
      );
      setArticle(res.data.payload);
      setCommentText("");
      toast.success("Comment added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `${API_URL}/common-api/articles/${id}/comments/${commentId}`,
        { withCredentials: true }
      );
      setArticle(res.data.payload);
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment");
    }
  };

  // Check if current user can delete a specific comment
  const canDeleteComment = (comment) => {
    if (!currentUser) return false;
    const isCommentOwner = comment.user?._id === currentUser.userId;
    const isArticleAuthor = article?.author?._id === currentUser.userId;
    return isCommentOwner || isArticleAuthor;
  };

  if (loading) return <p className={loadingClass}>Loading article...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!article) return <p className={errorClass}>Article not found</p>;

  return (
    <div className={articlePageWrapper}>
      {/* ── Article Header ─────────────────────────── */}
      <div className={articleHeader}>
        <p className={articleCategory}>{article.category}</p>
        <h1 className={articleMainTitle}>{article.title}</h1>
      </div>

      {/* ── Author Row ─────────────────────────────── */}
      <div className={articleAuthorRow}>
        <div className={authorInfo}>
          {article.author?.profileImageUrl ? (
            <img
              src={article.author.profileImageUrl}
              alt="Author"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#0066cc] flex items-center justify-center text-sm font-bold text-white">
              {article.author?.firstName?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <span>
            {article.author?.firstName} {article.author?.lastName}
          </span>
        </div>
        <span className="text-xs text-[#a1a1a6]">
          {new Date(article.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {/* ── Article Content ────────────────────────── */}
      <div className={articleContent}>{article.content}</div>

      {/* ── Comments Section ───────────────────────── */}
      <div className={articleFooter}>
        <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight mb-5">
          Comments ({article.comments?.length || 0})
        </h2>

        {/* Add Comment Form (only for logged-in USERs) */}
        {isAuthenticated && currentUser?.role === "USER" && (
          <form onSubmit={handleAddComment} className="mb-6">
            <div className="flex gap-3 items-start">
              {/* User avatar */}
              {currentUser?.profileImageUrl ? (
                <img
                  src={currentUser.profileImageUrl}
                  alt="You"
                  className="w-9 h-9 rounded-full object-cover mt-0.5"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#0066cc] flex items-center justify-center text-sm font-bold text-white mt-0.5 shrink-0">
                  {currentUser?.firstName?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={submitting || !commentText.trim()}
                    className={`${primaryBtn} ${
                      submitting || !commentText.trim()
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {submitting ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Not logged in message */}
        {!isAuthenticated && (
          <p className="text-sm text-[#a1a1a6] mb-6">
            Please{" "}
            <a href="/login" className="text-[#0066cc] hover:text-[#004499]">
              log in
            </a>{" "}
            to add a comment.
          </p>
        )}

        {/* Comments List */}
        {article.comments?.length === 0 ? (
          <p className="text-sm text-[#a1a1a6] py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {article.comments?.map((c) => (
              <div
                key={c._id}
                className="bg-[#f5f5f7] rounded-xl p-4 flex gap-3"
              >
                {/* Commenter avatar */}
                {c.user?.profileImageUrl ? (
                  <img
                    src={c.user.profileImageUrl}
                    alt={c.user.firstName}
                    className="w-8 h-8 rounded-full object-cover mt-0.5"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#6e6e73] flex items-center justify-center text-sm font-bold text-white mt-0.5 shrink-0">
                    {c.user?.firstName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}

                <div className="flex-1">
                  {/* Name */}
                  <p className="text-sm font-semibold text-[#1d1d1f]">
                    {c.user?.firstName} {c.user?.lastName}
                  </p>
                  {/* Comment text */}
                  <p className="text-sm text-[#6e6e73] mt-1 leading-relaxed">
                    {c.comment}
                  </p>
                </div>

                {/* Delete button */}
                {canDeleteComment(c) && (
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    className="text-[#ff3b30] text-xs font-medium hover:text-[#cc2f26] transition-colors cursor-pointer self-start shrink-0"
                    title="Delete comment"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Article;