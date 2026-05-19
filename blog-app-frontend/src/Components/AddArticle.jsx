import React, { useState } from 'react'
import { useForm } from "react-hook-form"

import axios from 'axios';
import { API_URL } from '../config.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import {
  loadingClass,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
} from '../styles/common';

const AddArticle = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const submitHandler = async (articleObj) => {
        setLoading(true);
        try {
            await axios.post(`${API_URL}/author-api/articles`,
                articleObj,
                { withCredentials: true }
            );
            toast.success("Article Published Successfully!");
            reset();
            navigate("/author-profile");
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to publish article")
        } finally {
            setLoading(false)
        }
    }

    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1d1d1f] tracking-tight mb-2">
            Write New Article
          </h1>
          <p className="text-sm text-[#6e6e73]">
            Share your knowledge with the community
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#f5f5f7] rounded-2xl p-8">
          <form onSubmit={handleSubmit(submitHandler)}>
            {/* Title */}
            <div className={formGroup}>
              <label className={labelClass}>Title</label>
              <input
                {...register("title", { required: true })}
                className={inputClass}
                type="text"
                placeholder="Enter a compelling title..."
              />
              {errors.title?.type === "required" && (
                <p className='text-[#ff3b30] text-xs mt-1'>Title is required</p>
              )}
            </div>

            {/* Category */}
            <div className={formGroup}>
              <label className={labelClass}>Category</label>
              <select
                className={inputClass}
                {...register("category", { required: true })}
              >
                <option value="">Select a category</option>
                <option value="programming">Programming</option>
                <option value="DSA">DSA</option>
                <option value="AI/ML">AI / ML</option>
                <option value="WebDev">Web Development</option>
              </select>
              {errors.category?.type === "required" && (
                <p className='text-[#ff3b30] text-xs mt-1'>Category is required</p>
              )}
            </div>

            {/* Content */}
            <div className={formGroup}>
              <label className={labelClass}>Content</label>
              <textarea
                placeholder="Write your article content here..."
                rows={12}
                className={`${inputClass} resize-none`}
                {...register("content", { required: true })}
              />
              {errors.content?.type === "required" && (
                <p className='text-[#ff3b30] text-xs mt-1'>Content is required</p>
              )}
            </div>

            <button className={submitBtn} type="submit" disabled={loading}>
              {loading ? "Publishing..." : "Publish Article"}
            </button>

            {loading && (
              <p className={`${loadingClass} mt-3`}>Publishing your article...</p>
            )}
          </form>
        </div>
      </div>
    )
}

export default AddArticle