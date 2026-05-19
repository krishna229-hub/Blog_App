import React from "react";
import { Link } from "react-router";

function Footer() {
  return (
    <footer className="border-t border-[#e8e8ed] mt-16">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#6e6e73]">
          © {new Date().getFullYear()} <span className="font-semibold text-[#1d1d1f]">BlogApp</span>. Built with MERN Stack.
        </p>
        <div className="flex gap-5">
          <Link to="/" className="text-xs text-[#a1a1a6] hover:text-[#1d1d1f] transition-colors">Home</Link>
          <Link to="/register" className="text-xs text-[#a1a1a6] hover:text-[#1d1d1f] transition-colors">Register</Link>
          <Link to="/login" className="text-xs text-[#a1a1a6] hover:text-[#1d1d1f] transition-colors">Login</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;