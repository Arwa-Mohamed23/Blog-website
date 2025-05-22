import React from "react";
import { Link, NavLink } from "react-router";

export default function Navbar({ user, onLogout }) {
  return (
    <div className="navbar bg-white shadow-lg border-b border-cyan-100 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container menu-horizontal mx-auto px-4">
        <div className="flex-1">
          <Link
            to="/"
            className="btn btn-ghost text-xl hover:bg-cyan-100 transition-all duration-200"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
            </div>
            <span className="font-bold text-gray-800">BlogHub</span>
          </Link>
        </div>

        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 gap-2">
            {user ? (
              <>
                <li className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar border-2 border-cyan-200 hover:border-cyan-400 transition-all duration-200"
                  >
                    <div className="w-10 rounded-full">
                      <img
                        alt={user.username}
                        src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=06b6d4&color=ffffff&bold=true`}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-white rounded-2xl w-56 border border-cyan-100"
                  >
                    <li>
                      <NavLink
                        className={({ isActive }) =>
                          `flex items-center gap-3 p-3 rounded-xl hover:bg-cyan-50 transition-all duration-200 ${
                            isActive
                              ? "bg-cyan-100 text-cyan-700 font-semibold"
                              : "text-gray-700"
                          }`
                        }
                        to="/profile"
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
                            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                        Profile
                      </NavLink>
                    </li>
                    <div className="divider my-2"></div>
                    <li>
                      <button
                        onClick={onLogout}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-200 w-full"
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
                            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                          />
                        </svg>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `btn btn-ghost font-semibold rounded-xl px-6 transition-all duration-200 ${
                        isActive
                          ? "bg-cyan-100 text-cyan-700 border-cyan-200"
                          : "text-gray-700 hover:bg-cyan-50 hover:text-cyan-600"
                      }`
                    }
                    to="/login"
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `btn font-semibold rounded-xl px-6 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-0"
                          : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 hover:from-cyan-600 hover:to-blue-600"
                      }`
                    }
                    to="/register"
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
