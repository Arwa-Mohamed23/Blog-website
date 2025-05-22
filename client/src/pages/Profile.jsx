import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function UserDetails({ user, setUser }) {
  const [userFormData, setUserFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setUserFormData({
        username: user.username || "",
        email: user.email || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
      });
    }
  }, [user]);

  const handleUserFormChange = (e) => {
    setUserFormData({
      ...userFormData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }
  };

  const validateUserForm = () => {
    const newErrors = {};
    if (!userFormData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!userFormData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userFormData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!userFormData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!userFormData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    if (!validateUserForm()) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.patch("/api/user/", userFormData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setUser({
        ...user,
        ...data,
      });

      toast.success("User details updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);

      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        toast.error("Failed to update user details");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-start py-12 px-4 bg-gradient-to-br from-cyan-50 to-blue-50 min-h-screen">
      <div className="card bg-white shadow-2xl border border-cyan-100 w-full max-w-2xl">
        <div className="card-body p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="card-title text-3xl font-bold text-gray-800 justify-center">
              Update Profile
            </h2>
          </div>

          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 flex items-center">
                    First Name
                  </span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={userFormData.first_name}
                  onChange={handleUserFormChange}
                  className={`input input-bordered w-full bg-white border-2 transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 ${
                    errors.first_name
                      ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200"
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.first_name && (
                  <label className="label">
                    <span className="label-text-alt text-red-500 flex items-center">
                      {errors.first_name}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 flex items-center">
                    Last Name
                  </span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={userFormData.last_name}
                  onChange={handleUserFormChange}
                  className={`input input-bordered w-full bg-white border-2 transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 ${
                    errors.last_name
                      ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200"
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.last_name && (
                  <label className="label">
                    <span className="label-text-alt text-red-500 flex items-center">
                      {errors.last_name}
                    </span>
                  </label>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-cyan-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Username
                </span>
              </label>
              <input
                type="text"
                name="username"
                value={userFormData.username}
                onChange={handleUserFormChange}
                className={`input input-bordered w-full bg-white border-2 transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 ${
                  errors.username
                    ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                    : "border-gray-200"
                }`}
                placeholder="Enter your username"
              />
              {errors.username && (
                <label className="label">
                  <span className="label-text-alt text-red-500 flex items-center">
                    {errors.username}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-cyan-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={userFormData.email}
                onChange={handleUserFormChange}
                className={`input input-bordered w-full bg-white border-2 transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 ${
                  errors.email
                    ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                    : "border-gray-200"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-red-500 flex items-center">
                    {errors.email}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control mt-8">
              <button
                type="submit"
                className="btn bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 text-white font-semibold py-3 h-auto min-h-0 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center">
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Update Profile
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
