import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

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
    if (!window.confirm("Are you sure you want to delete this post?")) return;

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="h-64 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
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
          <span>{error || "Post not found"}</span>
        </div>
        <div className="flex-none">
          <Link to="/" className="btn btn-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      {post.image && (
        <div className="w-full">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-96 object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

        <div className="flex items-center text-gray-500 text-sm mb-6">
          <span>By {post.author_username}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(post.created_at)}</span>

          {post.created_at !== post.updated_at && (
            <>
              <span className="mx-2">•</span>
              <span>Updated: {formatDate(post.updated_at)}</span>
            </>
          )}
        </div>

        <div className="prose max-w-none mb-8">
          <p className="whitespace-pre-line">{post.description}</p>
        </div>

        {user && post.author === user.id && (
          <div className="flex justify-end gap-2 mt-6">
            <Link
              to={`/posts/edit/${post.id}`}
              className="btn btn-outline btn-info"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-error"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
