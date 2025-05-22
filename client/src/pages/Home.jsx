import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import PostCard from "../components/PostCard";

export default function Home({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/posts/");
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again later.");
        toast.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-96 flex justify-center items-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-cyan-500"></span>
          <p className="mt-4 text-gray-600 font-medium">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-16">
        <div className="alert shadow-lg border border-red-200 bg-red-50">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="ml-3">
              <h3 className="font-semibold text-red-800">
                Oops! Something went wrong
              </h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
          <div className="flex-none">
            <button
              onClick={() => window.location.reload()}
              className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-0"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-96 flex flex-col justify-center items-center text-center">
        <div className="max-w-md mx-auto">
          <div className="w-32 h-32 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg
              className="w-16 h-16 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            No Posts Yet
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Be the first to share your thoughts.
          </p>

          {user ? (
            <Link
              to="/posts/create"
              className="btn bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 text-white font-semibold rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create First Post
            </Link>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Join to start posting</p>
              <div className="flex gap-3 justify-center">
                <Link
                  to="/login"
                  className="btn btn-outline border-cyan-400 text-cyan-600 hover:bg-cyan-50 hover:border-cyan-500 font-semibold rounded-xl px-6"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 text-white font-semibold rounded-xl px-6"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Latest Posts
          </h1>
          {user && (
            <Link
              to="/posts/create"
              className="btn bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 text-white font-semibold rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Share Your Post
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
