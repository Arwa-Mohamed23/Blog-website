import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import PostCard from "../components/PostCard";

export default function PostDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/posts/${id}/`);
      setPost(data);
    } catch (error) {
      console.error("Error fetching post details:", error);
      setError(
        "Failed to load post details. The post might have been removed or you don't have permission to view it."
      );
      toast.error("Failed to load post details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const token = localStorage.getItem("token");
      await axios.delete(`/api/posts/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      toast.success("Post deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-96 flex justify-center items-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-cyan-500"></span>
          <p className="mt-4 text-gray-600 font-medium">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
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
              <p className="text-red-700">{error || "Post not found"}</p>
            </div>
          </div>
          <div className="flex-none">
            <Link
              to="/"
              className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-0"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <PostCard
        post={post}
        isDetailView={true}
        user={user}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
      <div className="text-center mt-12">
        <Link
          to="/"
          className="btn btn-outline border-cyan-400 text-cyan-600 hover:bg-cyan-50 hover:border-cyan-500 font-semibold rounded-xl px-8"
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
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
          Back to All Posts
        </Link>
      </div>
    </div>
  );
}
