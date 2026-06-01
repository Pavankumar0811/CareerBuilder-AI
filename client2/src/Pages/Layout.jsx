import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import loader from '../components/loader';
import Login from './Login';

const Layout = () => {


    const {user, loading} = useSelector(state => state.auth)

    if(loading) {
        return <loader />
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