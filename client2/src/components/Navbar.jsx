import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate()
    const logoutuser = () => {
        navigate("/")
    }
    return (
        <div className='shadow bg-black'>
            <nav className='flex item-center justify-between max-w-7x1 mx-auto px-20 py-3.5 text-slate-800 transition-all'>
          <Link to="/">
            <img width={100} src="/logo3.png" alt="logo" />
          </Link>
          <div className='flex items-center gap-4 text-sm'>
            <button onClick={logoutuser} className='bg-black hover:bg-slate-50 border border-green-300 px-6 py-1.5 rounded-full active:scale-95 transition-all'>
                <span className='text-white'>Logout</span>
            </button>
          </div>
            </nav>
            
        </div>
    );
};

export default Navbar;