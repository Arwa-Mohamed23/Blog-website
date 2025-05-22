import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

export default function CreateEditPost({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchPostData();
    }
  }, [id]);

  const fetchPostData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`/api/posts/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setFormData({
        title: data.title,
        description: data.description,
        image: null,
      });

      if (data.image) {
        setImagePreview(data.image);
      }
    } catch (error) {
      console.error("Error fetching post:", error);

      if (error.response && error.response.status === 403) {
        toast.error("You don't have permission to edit this post");
        navigate("/");
      } else {
        toast.error("Failed to load post data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      if (file) {
        setFormData({
          ...formData,
          image: file,
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!isEditMode && !formData.image) {
      newErrors.image = "Image is required for new posts";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const postData = new FormData();
      postData.append("title", formData.title);
      postData.append("description", formData.description);

      if (formData.image) {
        postData.append("image", formData.image);
      }

      let response;

      if (isEditMode) {
        response = await axios.patch(`/api/posts/${id}/`, postData, config);
        toast.success("Post updated successfully!");
      } else {
        response = await axios.post("/api/posts/", postData, config);
        toast.success("Post created successfully!");
      }

      navigate(`/posts/${response.data.id}`);
    } catch (error) {
      console.error("Error saving post:", error);

      if (error.response && error.response.data) {
        if (typeof error.response.data === "object") {
          setErrors(error.response.data);
        }
      } else {
        toast.error(`Failed to ${isEditMode ? "update" : "create"} post`);
      }

      setSubmitting(false);
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null,
    });
    setImagePreview(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-cyan-500"></span>
          <p className="mt-4 text-gray-600 font-medium">Loading post data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-white shadow-2xl border border-cyan-100">
          <div className="card-body p-8">
            {/* Header */}
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
                    d={
                      isEditMode
                        ? "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        : "M12 4v16m8-8H4"
                    }
                  />
                </svg>
              </div>
              <h2 className="card-title text-3xl font-bold text-gray-800 justify-center">
                {isEditMode ? "Edit Post" : "Create New Post"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Field */}
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
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    Post Title
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a title for your post"
                  className={`input input-bordered w-full bg-white border-2 transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 ${
                    errors.title
                      ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200"
                  }`}
                />
                {errors.title && (
                  <label className="label">
                    <span className="label-text-alt text-red-500 flex items-center">
                      {errors.title}
                    </span>
                  </label>
                )}
              </div>
              {/* Description Field */}
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Content
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write your post content here...."
                  rows="8"
                  className={`textarea textarea-bordered w-full bg-white border-2 transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 resize-none ${
                    errors.description
                      ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200"
                  }`}
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.description && (
                    <span className="label-text-alt text-red-500 flex items-center">
                      {errors.description}
                    </span>
                  )}
                </div>
              </div>
              {/* Image Upload Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">
                    Post Image
                    {!isEditMode && <span className="text-red-500">*</span>}
                  </span>
                </label>

                {imagePreview ? (
                  <div className="mb-6 relative">
                    <img
                      src={imagePreview}
                      alt="Post preview"
                      className="w-full max-h-80 object-cover rounded-xl border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-4 right-4 btn btn-circle btn-sm bg-red-500 hover:bg-red-600 border-0 text-white"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center ${
                      errors.image ? "border-red-400" : "border-gray-300"
                    }`}
                  >
                    <div className="text-gray-600 mb-4">
                      <svg
                        className={`w-12 h-12 mx-auto mb-4 ${
                          dragActive ? "text-cyan-500" : "text-gray-400"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      className="hidden"
                      accept="image/*"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="btn bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 text-white font-semibold rounded-lg px-6 cursor-pointer"
                    >
                      Choose File
                    </label>
                    <p className="text-gray-500 text-sm mt-2">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}

                {isEditMode && !imagePreview && (
                  <p className="text-sm text-gray-500 mt-2">
                    Leave empty to keep current image
                  </p>
                )}
                {errors.image && (
                  <p className="text-sm text-red-500 mt-2">{errors.image}</p>
                )}
              </div>
              {/* Action Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-outline border-gray-400 text-gray-600 hover:bg-gray-100 hover:border-gray-500 font-semibold rounded-xl px-8 order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 text-white font-semibold rounded-xl px-8 flex-1 sm:flex-none shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 order-1 sm:order-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      {isEditMode ? "Updating..." : "Creating..."}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      {isEditMode ? "Update Post" : "Create Post"}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
