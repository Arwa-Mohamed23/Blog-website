import React, { useState } from "react";
import { Link } from "react-router";

export default function PostCard({
  post,
  isDetailView = false,
  user,
  onDelete,
  isDeleting,
}) {
  const [isLiked, setIsLiked] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    if (onDelete) {
      await onDelete();
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const PostHeader = () => (
    <div className="flex flex-wrap items-center gap-4 text-gray-600">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {post.author_username.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="font-medium">{post.author_username}</span>
      </div>

      <div className="flex items-center gap-1">
        <svg
          className="w-4 h-4 text-cyan-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm">{formatDate(post.created_at)}</span>
      </div>
    </div>
  );

  const PostImage = ({ isDetail }) => (
    <figure
      className={
        isDetail
          ? "relative"
          : "relative overflow-hidden flex justify-center bg-gray-50"
      }
    >
      <img
        src={post.image}
        alt={post.title}
        className={`w-full h-auto ${
          isDetail
            ? "object-contain max-h-96"
            : "max-w-full max-h-64 object-contain transition-transform duration-300 hover:scale-105"
        }`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/${
          isDetail ? "20" : "30"
        } to-transparent ${
          isDetail
            ? ""
            : "opacity-0 hover:opacity-100 transition-opacity duration-300"
        }`}
      ></div>
    </figure>
  );

  const LikeButton = () => (
    <button onClick={toggleLike} className="flex items-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isLiked ? "red" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke={isLiked ? "red" : "currentColor"}
        className="size-6 hover:scale-110 transition-transform"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );

  const PostContent = () => (
    <>
      <h2
        className={`${
          isDetailView ? "text-4xl" : "text-xl"
        } font-bold text-gray-800 ${isDetailView ? "" : "line-clamp-2"} mb-3`}
      >
        {post.title}
      </h2>

      <div className={`${isDetailView ? "prose max-w-none" : ""}`}>
        <p
          className={`text-gray-600 ${
            isDetailView
              ? "leading-relaxed whitespace-pre-line text-lg"
              : "line-clamp-3 leading-relaxed"
          } mb-4`}
        >
          {post.description}
        </p>
      </div>
    </>
  );

  const ActionButtons = () => (
    <div
      className={`card-actions ${
        isDetailView ? "justify-end" : "justify-between"
      } items-center pt-4 border-t border-gray-100`}
    >
      {!isDetailView && (
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <LikeButton />
        </div>
      )}

      {isDetailView ? (
        user &&
        post.author === user.id && (
          <>
            <Link
              to={`/posts/edit/${post.id}`}
              className="btn bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 text-white font-semibold rounded-xl px-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              Edit Post
            </Link>
            <button
              onClick={handleDelete}
              className="btn bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 text-white font-semibold rounded-xl px-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              )}
              Delete Post
            </button>
          </>
        )
      ) : (
        <Link
          to={`/posts/${post.id}`}
          className="btn bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 text-white font-semibold rounded-xl px-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Read More
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      )}
    </div>
  );

  return (
    <div className={isDetailView ? "max-w-4xl mx-auto" : ""}>
      <div
        className={`card bg-white shadow-xl border border-cyan-100 overflow-hidden ${
          !isDetailView
            ? "hover:shadow-2xl hover:border-cyan-200 transition-all duration-300 transform hover:scale-105"
            : "shadow-2xl"
        }`}
      >
        {post.image && <PostImage isDetail={isDetailView} />}

        <div className={`card-body ${isDetailView ? "p-8" : "p-6"}`}>
          {isDetailView ? (
            <div className="mb-6">
              <PostHeader />
            </div>
          ) : (
            <div className="flex items-center justify-between mb-3">
              <PostHeader />
            </div>
          )}
          <PostContent />
          <ActionButtons />
        </div>
      </div>
    </div>
  );
}
