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
    <div className="flex justify-center">
      <div className="card bg-base-100 shadow-xl w-full max-w-2xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-6">User Profile</h2>

          <form onSubmit={handleUserSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={userFormData.first_name}
                  onChange={handleUserFormChange}
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
                  value={userFormData.last_name}
                  onChange={handleUserFormChange}
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
                value={userFormData.username}
                onChange={handleUserFormChange}
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
                value={userFormData.email}
                onChange={handleUserFormChange}
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

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Update User"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
