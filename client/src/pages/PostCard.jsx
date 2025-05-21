import React, { useEffect, useState } from "react";
import { Link } from "react-router";

export default function PostCard({ post }) {
  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      {post.image && (
        <figure>
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
        </figure>
      )}
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold">{post.title}</h2>
        <p className="text-sm text-gray-500">
          Posted by {post.author_username} on {formattedDate}
        </p>
        <p className="mt-4">{post.description}</p>
        <div className="card-actions justify-end mt-4">
          <Link to={`/posts/${post.id}`} className="btn btn-primary">
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}
