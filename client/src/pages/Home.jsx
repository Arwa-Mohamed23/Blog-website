import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PostCard from "./PostCard";

export default function Home() {
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
      <div className="h-64 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{error}</span>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">No posts yet</h2>
        <p>Be the first to create a post!</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">Latest Posts</h1>
      <div className="grid grid-cols-1 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}