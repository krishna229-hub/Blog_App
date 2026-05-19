import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../store/authStore";
import toast from "react-hot-toast";
import {
  loadingClass,
  errorClass,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
} from "../styles/common.js";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

  const submitHandler = async (data) => {
    setloading(true);

    const formData = new FormData();
    let { role, profileImageUrl, ...userObj } = data;
    Object.keys(userObj).forEach((key) => {
      formData.append(key, userObj[key]);
    });
    if (profileImageUrl?.[0]) {
      formData.append("profileImageUrl", profileImageUrl[0]);
    }

    try {
      let apiUrl =
        role === "AUTHOR"
          ? "http://localhost:4000/author-api/users"
          : "http://localhost:4000/user-api/users";

      let resObj = await axios.post(apiUrl, formData);

      if (resObj.status === 201) {
        toast.success("Registration successful!");

        let loginRes = await login({
          email: data.email,
          password: data.password,
        });

        if (loginRes.ok) {
          toast.success("Logged in successfully!");
          if (role === "USER") navigate("/user-profile");
          else if (role === "AUTHOR") navigate("/author-profile");
        } else {
          toast.error("Auto-login failed. Please login manually.");
          navigate("/login");
        }
      }
    } catch (err) {
      seterror(err.response?.data?.error || "Registration Failed");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (loading) {
    return <p className={loadingClass}>Creating your account...</p>;
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1d1d1f] tracking-tight mb-2">
          Create Account
        </h1>
        <p className="text-sm text-[#6e6e73]">
          Join BlogApp to start reading and sharing articles
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-[#f5f5f7] rounded-2xl p-8">
        {error && <p className={`${errorClass} mb-4`}>{error}</p>}

        <form onSubmit={handleSubmit(submitHandler)}>
          {/* Role Selection */}
          <div className={formGroup}>
            <label className={labelClass}>I want to join as</label>
            <div className="flex gap-3 mt-1">
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  {...register("role", { required: true })}
                  value="USER"
                  className="peer hidden"
                />
                <div className="bg-white border border-[#d2d2d7] rounded-xl px-4 py-3 text-center text-sm font-medium text-[#6e6e73] peer-checked:border-[#0066cc] peer-checked:text-[#0066cc] peer-checked:bg-[#0066cc]/5 transition-all">
                  👤 User
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  {...register("role", { required: true })}
                  value="AUTHOR"
                  className="peer hidden"
                />
                <div className="bg-white border border-[#d2d2d7] rounded-xl px-4 py-3 text-center text-sm font-medium text-[#6e6e73] peer-checked:border-[#0066cc] peer-checked:text-[#0066cc] peer-checked:bg-[#0066cc]/5 transition-all">
                  ✍️ Author
                </div>
              </label>
            </div>
            {errors.role?.type === "required" && (
              <p className="text-[#ff3b30] text-xs mt-1">Please select a role</p>
            )}
          </div>

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className={formGroup}>
              <label className={labelClass}>First Name</label>
              <input
                {...register("firstName", { required: true, minLength: 3 })}
                className={inputClass}
                type="text"
                placeholder="John"
              />
              {errors.firstName?.type === "required" && (
                <p className="text-[#ff3b30] text-xs mt-1">Required</p>
              )}
              {errors.firstName?.type === "minLength" && (
                <p className="text-[#ff3b30] text-xs mt-1">Min 3 characters</p>
              )}
            </div>
            <div className={formGroup}>
              <label className={labelClass}>Last Name</label>
              <input
                {...register("lastName")}
                className={inputClass}
                type="text"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              {...register("email", { required: true })}
              className={inputClass}
              type="email"
              placeholder="you@example.com"
            />
            {errors.email?.type === "required" && (
              <p className="text-[#ff3b30] text-xs mt-1">Email is required</p>
            )}
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              {...register("password", {
                required: true,
                minLength: 6,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
              })}
              className={inputClass}
              type="password"
              placeholder="••••••••"
            />
            {errors.password?.type === "required" && (
              <p className="text-[#ff3b30] text-xs mt-1">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-[#ff3b30] text-xs mt-1">Minimum 6 characters</p>
            )}
            {errors.password?.type === "pattern" && (
              <p className="text-[#ff3b30] text-xs mt-1">
                Must include uppercase, lowercase and number
              </p>
            )}
          </div>

          {/* Profile Image */}
          <div className={formGroup}>
            <label className={labelClass}>Profile Photo (optional)</label>
            <div className="flex items-center gap-4">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-14 h-14 object-cover rounded-full border-2 border-[#d2d2d7]"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#e8e8ed] flex items-center justify-center text-xl text-[#a1a1a6]">
                  👤
                </div>
              )}
              <input
                className="text-sm text-[#6e6e73] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#0066cc]/10 file:text-[#0066cc] hover:file:bg-[#0066cc]/20 file:cursor-pointer file:transition-colors"
                type="file"
                accept="image/png, image/jpeg"
                {...register("profileImageUrl")}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (!["image/jpeg", "image/png"].includes(file.type)) {
                      seterror("Only JPG or PNG allowed");
                      return;
                    }
                    if (file.size > 2 * 1024 * 1024) {
                      seterror("File size must be less than 2MB");
                      return;
                    }
                    setPreview(URL.createObjectURL(file));
                    seterror(null);
                  }
                }}
              />
            </div>
          </div>

          <button className={submitBtn} type="submit">
            Create Account
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-[#6e6e73] mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#0066cc] font-medium hover:text-[#004499] transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;