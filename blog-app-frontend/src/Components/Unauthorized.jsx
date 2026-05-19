import React from 'react'
import { Link } from 'react-router'
import { primaryBtn, secondaryBtn } from '../styles/common'

const Unauthorized = () => {
  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <div className="w-16 h-16 bg-[#ff3b30]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <span className="text-2xl">🚫</span>
      </div>
      <h1 className="text-2xl font-bold text-[#1d1d1f] tracking-tight mb-2">
        Access Denied
      </h1>
      <p className="text-sm text-[#6e6e73] mb-8">
        You don't have permission to view this page. Please sign in with the correct account.
      </p>
      <div className="flex gap-3 justify-center">
        <Link to="/login" className={primaryBtn}>
          Sign In
        </Link>
        <Link to="/" className={secondaryBtn}>
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default Unauthorized