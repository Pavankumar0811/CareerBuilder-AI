import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LoginModal from '../LoginModal';

const Hero = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [showLogin, setShowLogin] = React.useState(false);
    const { user } = useSelector(state => state.auth);

    const openAuthModal = () => {
        setShowLogin(true);
        setMobileOpen(false);
    };

    const stats = [
        { value: '10,000+', label: 'Resumes Created' },
        { value: '5,000+', label: 'ATS Checks Completed' },
        { value: '2,000+', label: 'Mock Interviews Taken' },
        { value: '1,000+', label: 'Coding Problems Solved' },
    ];

    return (
        <>
            <style>
                {`
                    @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
                    * {
                        font-family: "Poppins", sans-serif;
                    }
                    @keyframes rotate {
                        100% {
                            transform: rotate(1turn);
                        }
                    }

                    .rainbow::before {
                        content: '';
                        position: absolute;
                        z-index: -2;
                        left: -50%;
                        top: -50%;
                        width: 200%;
                        height: 200%;
                        background-position: 100% 50%;
                        background-repeat: no-repeat;
                        background-size: 50% 30%;
                        filter: blur(6px);
                        background-image: linear-gradient(#FFF);
                        animation: rotate 4s linear infinite;
                    }
                `}
            </style>

            <header className='bg-black text-white flex flex-col items-center bg-[url("https://assets.prebuiltui.com/images/components/hero-section/hero-background-image.png")] bg-cover bg-center bg-no-repeat pb-10'>
                <nav className="flex flex-col items-center w-full">
                    <div className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-4 w-full">
                        <a href="https://prebuiltui.com">
                            <img width={100} height={100} src="/logo3.png" alt="logo" />
                        </a>
                        <div id="menu" className={`${mobileOpen ? 'max-md:w-full' : 'max-md:w-0'} max-md:fixed max-md:top-0 max-md:z-10 max-md:left-0 max-md:transition-all max-md:duration-300 max-md:overflow-hidden max-md:h-screen max-md:bg-black/50 max-md:backdrop-blur max-md:flex-col max-md:justify-center flex items-center gap-8 text-sm`}>
                            <button type="button" onClick={openAuthModal} className="text-white/70 hover:text-white/80 mr-6">login</button>

                            <button id="close-menu" onClick={() => setMobileOpen(false)} className="md:hidden bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-md aspect-square font-medium transition">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>

                        <button id="open-menu" onClick={() => setMobileOpen(true)} className="md:hidden bg-gray-900 hover:bg-gray-800 text-gray-50 p-2 rounded-md aspect-square font-medium transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 12h16" /><path d="M4 18h16" /><path d="M4 6h16" />
                            </svg>
                        </button>
                    </div>
                </nav>

                <div className="rainbow relative z-0 bg-white/15 overflow-hidden p-px flex items-center justify-center rounded-full transition duration-300 active:scale-100 mt-28 md:mt-32">
                    <button className="flex items-center justify-center gap-3 pl-4 pr-6 py-3 text-white rounded-full font-medium bg-gray-900/80 backdrop-blur">
                        <div className="relative flex size-3.5 items-center justify-center">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-[#A6FF5D] opacity-75 animate-ping duration-300"></span>
                            <span className="relative inline-flex size-2 rounded-full bg-[#A6FF5D]"></span>
                        </div>
                        <span className='text-xs'>Added-Ai-features</span>
                    </button>
                </div>

                <h1 className="text-4xl md:text-[64px]/[82px] text-center max-w-4xl mt-5 bg-clip-text leading-tight px-4">
                    Build Your Dream Career with AI
                </h1>
                <p className="text-sm md:text-base text-gray-300 bg-clip-text text-center max-w-lg mt-4.5 px-4">
                    Everything you need to land your dream job — Resume Builder, ATS Checker, AI Mock Interviews, LeetCode Practice, Career Roadmaps, and Job Preparation Tools in one place.
                </p>

                <div className='flex gap-3 mt-8'>
                    <button onClick={openAuthModal} className="bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-800 px-6 py-2.5 rounded-full text-sm transition cursor-pointer group" hidden={user}>
                        <div className="relative overflow-hidden">
                            <span className="block transition-transform duration-200 group-hover:-translate-y-full">
                                Get Started today
                            </span>
                            <span className="absolute top-0 left-0 block transition-transform duration-200 group-hover:translate-y-0 translate-y-full">
                                Get Started today
                            </span>
                        </div>
                    </button>
                    <div className="bg-white/15 hover:bg-white/10 p-px flex items-center justify-center rounded-full hover:scale-105 transition duration-300 active:scale-100">
                        <Link to='/app?state=register' className="px-6 text-sm py-3 text-white rounded-full bg-white/5 cursor-pointer">
                            Our products
                        </Link>
                    </div>
                </div>
                {showLogin && <LoginModal initialMode="register" onClose={() => setShowLogin(false)} />}

                <div className="mt-16 w-full max-w-6xl px-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((item) => (
                            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-6 text-center backdrop-blur-sm">
                                <p className="text-3xl md:text-4xl font-semibold text-[#A6FF5D]">{item.value}</p>
                                <p className="mt-2 text-sm md:text-base text-gray-200">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </header>
        </>
    )
}

export default Hero;
