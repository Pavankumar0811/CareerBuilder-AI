import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import Login from './Login';

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Layout = () => {
    const {user, loading} = useSelector(state => state.auth)

    if(loading) {
        return <Loader />
    }

    return (
      <div>
        {
         user ? (
          <div className='min-h-screen bg-black'>
              <Navbar />
              <Outlet />
          </div>
         )
        : <Login />
        }
      </div>
    );
};

export default Layout;