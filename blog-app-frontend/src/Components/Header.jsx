import React from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useAuth } from '../store/authStore';
import toast from 'react-hot-toast';

const Header = () => {
  const navigate = useNavigate();
  const currentUser = useAuth(state => state.currentUser);
  const isAuthenticated = useAuth(state => state.isAuthenticated);
  const logout = useAuth(state => state.logout);

  const role = currentUser?.role;

  const onLogout = async() => {
    await logout();
    toast.success("Logged out")
    navigate("/login")
  }

  const linkBase = "text-[0.8rem] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors font-medium capitalize";
  const activeClass = "text-[0.8rem] text-[#0066cc] font-semibold";

  return (
    <nav className='bg-white/85 backdrop-blur-xl backdrop-saturate-150 border-b border-[#e8e8ed] px-6 md:px-8 h-[56px] flex items-center sticky top-0 z-50'>
      <div className='max-w-5xl mx-auto w-full flex items-center justify-between'>
        {/* Brand */}
        <NavLink to="/" className="text-lg font-bold text-[#1d1d1f] tracking-tight hover:text-[#0066cc] transition-colors">
          ✍️ BlogApp
        </NavLink>

        {/* Nav Links */}
        <div className='flex gap-5 items-center'>
          <NavLink
            to="/"
            className={({isActive}) => isActive ? activeClass : linkBase}
          >
            Home
          </NavLink>

          {!isAuthenticated && (
            <>
              <NavLink
                to="register"
                className={({isActive}) => isActive ? activeClass : linkBase}
              >
                Register
              </NavLink>
              <NavLink
                to="login"
                className="bg-[#0066cc] text-white text-[0.8rem] font-semibold px-4 py-1.5 rounded-full hover:bg-[#004499] transition-colors"
              >
                Login
              </NavLink>
            </>
          )}

          {isAuthenticated && role === "USER" && (
            <>
              <NavLink
                to="user-profile"
                className={({isActive}) => isActive ? activeClass : linkBase}
              >
                Profile
              </NavLink>
              <NavLink
                to="user-dashboard"
                className={({isActive}) => isActive ? activeClass : linkBase}
              >
                Dashboard
              </NavLink>
            </>
          )}

          {isAuthenticated && role === "AUTHOR" && (
            <>
              <NavLink
                to="author-profile"
                className={({isActive}) => isActive ? activeClass : linkBase}
              >
                Profile
              </NavLink>
              <NavLink
                to="add-article"
                className={({isActive}) => isActive ? activeClass : linkBase}
              >
                New Article
              </NavLink>
              <NavLink
                to="author-dashboard"
                className={({isActive}) => isActive ? activeClass : linkBase}
              >
                Dashboard
              </NavLink>
            </>
          )}

          {isAuthenticated && (
            <button
              onClick={onLogout}
              className="text-[0.8rem] text-[#ff3b30] font-medium hover:text-[#cc2f26] transition-colors cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header