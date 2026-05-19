import React, { useEffect } from 'react'
import Login from './Login'
import Home from './Home'
import Header from './Header'
import { Outlet, useLocation } from 'react-router'
import Footer from './Footer'
import { useAuth } from '../store/authStore'
import { loadingClass } from '../styles/common'

const RootLayout = () => {
  
  const checkAuth = useAuth(state => state.checkAuth);
  const loading = useAuth(state => state.loading);
  const { pathname } = useLocation();

  useEffect(() => {
    checkAuth();
  },[checkAuth])

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if(loading){
    return <p className={loadingClass}>Loading...</p>
  }
  return (
    <div>
      <Header />
      <div className='min-h-screen'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default RootLayout