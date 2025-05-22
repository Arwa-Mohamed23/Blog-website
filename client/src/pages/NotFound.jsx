import React from "react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex justify-center items-center min-h-screen py-12 px-4 bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="card w-full max-w-md bg-white shadow-2xl border border-cyan-100">
        <div className="card-body p-8 text-center">
          <h1 className="text-5xl font-bold text-red-500 mb-2">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for doesn't exist.
          </p>
          <Link
            to="/"
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
