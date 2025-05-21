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
        navigate("/my-posts");
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

  if (loading) {
    return (
      <div className="h-64 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold mb-6">
          {isEditMode ? "Edit Post" : "Create New Post"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              className={`input input-bordered ${
                errors.title ? "input-error" : ""
              }`}
            />
            {errors.title && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.title}
                </span>
              </label>
            )}
          </div>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter post content"
              className={`textarea textarea-bordered h-40 ${
                errors.description ? "textarea-error" : ""
              }`}
            />
            {errors.description && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.description}
                </span>
              </label>
            )}
          </div>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">
                Image {!isEditMode && <span className="text-error">*</span>}
              </span>
            </label>

            {imagePreview && (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Post preview"
                  className="w-full max-h-60 object-cover rounded-lg"
                />
              </div>
            )}

            <input
              type="file"
              name="image"
              onChange={handleChange}
              className={`file-input file-input-bordered w-full ${
                errors.image ? "file-input-error" : ""
              }`}
              accept="image/*"
            />
            {isEditMode && (
              <label className="label">
                <span className="label-text-alt">
                  Leave empty to keep the current image
                </span>
              </label>
            )}
            {errors.image && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.image}
                </span>
              </label>
            )}
          </div>

          <div className="form-control mt-6 flex-row gap-2 justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <span className="loading loading-spinner"></span>
              ) : isEditMode ? (
                "Update Post"
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
