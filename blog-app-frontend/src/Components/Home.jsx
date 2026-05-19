import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../store/authStore";
import axios from "axios";
import Card from "./Card";
import { articleGrid, loadingClass, errorClass, primaryBtn, secondaryBtn } from "../styles/common";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);

  // Only fetch articles if user is logged in
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:4000/common-api/articles"
        );
        setArticles(res.data.payload);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [isAuthenticated]);

  return (
    <div className="min-h-[80vh]">
      {/* ── Hero Section ───────────────────────────── */}
      <div className="max-w-3xl mx-auto text-center pt-20 pb-14 px-6">
        <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#0066cc] mb-4">
          Welcome to BlogApp
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight leading-tight mb-5">
          Read, Write & Share
          <br />
          <span className="text-[#6e6e73]">Your Ideas with the World</span>
        </h1>
        <p className="text-[#6e6e73] text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          A platform for articles on programming, AI/ML, web development and more.
        </p>

        {!isAuthenticated ? (
          <div className="flex gap-3 justify-center">
            <Link to="/register" className={primaryBtn}>
              Get Started
            </Link>
            <Link to="/login" className={secondaryBtn}>
              Sign In
            </Link>
          </div>
        ) : (
          <Link
            to={
              currentUser?.role === "AUTHOR"
                ? "/author-profile"
                : "/user-profile"
            }
            className={primaryBtn}
          >
            Go to Profile →
          </Link>
        )}
      </div>

      {/* ── Divider ────────────────────────────────── */}
      <div className="border-t border-[#e8e8ed]"></div>

      {/* ── Articles Section ───────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        {!isAuthenticated ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#f5f5f7] rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight mb-2">
              Sign in to browse articles
            </h2>
            <p className="text-sm text-[#a1a1a6] max-w-md mx-auto">
              Create an account or log in to start reading and commenting on articles.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight mb-6">
              Latest Articles
            </h2>

            {loading && <p className={loadingClass}>Loading articles...</p>}
            {error && <p className={errorClass}>{error}</p>}

            {!loading && !error && articles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#a1a1a6] text-base">No articles published yet.</p>
              </div>
            )}

            {!loading && !error && articles.length > 0 && (
              <div className={articleGrid}>
                {articles.map((articleObj) => (
                  <Card key={articleObj._id} articleObj={articleObj} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;