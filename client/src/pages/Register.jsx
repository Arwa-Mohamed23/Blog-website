import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

export default function Register({ onLogin, user }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
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
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const { data } = await axios.post("/api/register/", formData);

      toast.success("Registration successful!");

      onLogin(data.user, data.token);
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response && error.response.data) {
        setErrors(error.response.data);
        toast.error("Please fix the errors in the form.");
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
            Create Account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className={`input input-bordered ${
                    errors.first_name ? "input-error" : ""
                  }`}
                />
                {errors.first_name && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.first_name}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className={`input input-bordered ${
                    errors.last_name ? "input-error" : ""
                  }`}
                />
                {errors.last_name && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.last_name}
                    </span>
                  </label>
                )}
              </div>
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
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

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={`input input-bordered ${
                  errors.email ? "input-error" : ""
                }`}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
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
                  "Register"
                )}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <p className="text-center">
            Already have an account?{" "}
            <button
              className="btn btn-link p-0 h-auto min-h-0"
              onClick={() => navigate("/login")}
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
