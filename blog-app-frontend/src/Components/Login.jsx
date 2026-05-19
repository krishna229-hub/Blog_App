import React, { useEffect } from 'react'
import { useForm } from "react-hook-form"
import { useAuth } from "../store/authStore"
import { useNavigate, Link } from 'react-router';
import {
  errorClass,
  loadingClass,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
} from '../styles/common';
import toast from 'react-hot-toast';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const login = useAuth(state => state.login)
    const currentUser = useAuth(state => state.currentUser);
    const isAuthenticated = useAuth(state => state.isAuthenticated)
    const loading = useAuth(state => state.loading);
    const error = useAuth(state => state.error);
    const navigate = useNavigate();

    const submitHandler = async (data) => {
        let res = await login(data);
        if (!res.ok) {
            toast.error(res.message);
            return;
        }
        toast.success("Login successful");
    }

    useEffect(() => {
        if (isAuthenticated) {
            if (currentUser?.role === "USER") {
                navigate("/user-profile")
            }
            if (currentUser?.role === "AUTHOR") {
                navigate("/author-profile")
            }
        }
    }, [isAuthenticated, currentUser]);

    if (loading) {
        return <p className={loadingClass}>Signing in...</p>
    }

    return (
      <div className="max-w-md mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1d1d1f] tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-[#6e6e73]">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#f5f5f7] rounded-2xl p-8">
          {error && <p className={`${errorClass} mb-4`}>{error}</p>}

          <form onSubmit={handleSubmit(submitHandler)}>
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
                <p className='text-[#ff3b30] text-xs mt-1'>Email is required</p>
              )}
            </div>

            {/* Password */}
            <div className={formGroup}>
              <label className={labelClass}>Password</label>
              <input
                {...register("password", {
                  required: true,
                  minLength: 6,
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
                })}
                className={inputClass}
                type="password"
                placeholder="••••••••"
              />
              {errors.password?.type === 'required' && (
                <p className='text-[#ff3b30] text-xs mt-1'>Password is required</p>
              )}
              {errors.password?.type === 'minLength' && (
                <p className='text-[#ff3b30] text-xs mt-1'>Minimum 6 characters</p>
              )}
              {errors.password?.type === 'pattern' && (
                <p className='text-[#ff3b30] text-xs mt-1'>Must include uppercase, lowercase and number</p>
              )}
            </div>

            <button className={submitBtn} type="submit">
              Sign In
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-[#6e6e73] mt-5">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#0066cc] font-medium hover:text-[#004499] transition-colors">
              Register
            </Link>
          </p>
        </div>
      </div>
    )
}

export default Login