import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

export default function Login({ onLogin, user }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const { data } = await axios.post("/api/login/", formData);

      const userData = {
        id: data.user_id,
        username: data.username,
        email: data.email,
      };

      toast.success("Login successful!");
      onLogin(userData, data.token);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      if (error.response && error.response.data) {
        if (typeof error.response.data === "object") {
          setErrors(error.response.data);
        } else {
          toast.error("Invalid credentials. Please try again.");
        }
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 px-4">
      <div className="card w-full max-w-md bg-white shadow-2xl border border-cyan-100">
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
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <h2 className="card-title text-3xl font-bold text-gray-800 justify-center">
              Welcome Back
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className={`input input-bordered w-full bg-white border-2 transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 ${
                  errors.username
                    ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                    : "border-gray-200"
                }`}
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`input input-bordered w-full bg-white border-2 pr-12 transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 ${
                    errors.password
                      ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l4.242 4.242M8.464 8.464L6.636 6.636M8.464 8.464L14.83 14.83M14.83 14.83l1.414 1.414M14.83 14.83l-4.242-4.242M14.83 14.83L18.05 18.05"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-red-500 flex items-center">
                    {errors.password}
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
                    Signing In...
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
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign In
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="divider text-gray-400 my-8">OR</div>
          <div className="text-center">
            <p className="text-gray-600 mb-4">Don't have an account?</p>
            <button
              className="btn btn-outline border-cyan-400 text-cyan-600 hover:bg-cyan-500 hover:border-cyan-500 hover:text-white font-semibold rounded-xl px-8 transition-all duration-200"
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
