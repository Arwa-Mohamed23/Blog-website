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
    <div className="flex justify-center items-center py-12">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className={`input input-bordered ${
                  errors.username ? "input-error" : ""
                }`}
              />
              {errors.username && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.username}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`input input-bordered ${
                  errors.password ? "input-error" : ""
                }`}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <p className="text-center">
            Don't have an account?{" "}
            <button
              className="btn btn-link p-0 h-auto min-h-0"
              onClick={() => navigate("/register")}
            >
              Register now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
