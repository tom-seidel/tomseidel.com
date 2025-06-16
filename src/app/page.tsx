'use client';

import { useState } from 'react';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const borderClass = menuOpen ? '' : 'border-b-2 border-white/20';

  return (
    <div className="bg-neutral-500 min-h-screen">
      {/* Navbar */}
<nav
  className={`flex justify-between p-4 sticky top-0 bg-white/10 backdrop-blur-md z-50 ${borderClass}`}>
        {/* Logo */}
        <div className="text-white text-xl">Tom Seidel</div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <path d="M3 6h18M3 12h18m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <ul className="hidden space-x-4 sm:flex">
          <li><a href="#" className="text-white hover:text-gray-400">Home</a></li>
          <li><a href="#" className="text-white hover:text-gray-400">About</a></li>
          <li><a href="#" className="text-white hover:text-gray-400">Projects</a></li>
          <li><a href="#" className="text-white hover:text-gray-400">Blog</a></li>
        </ul>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="sm:hidden w-full text-xl bg-white/10 backdrop-blur-md border-b-2 border-white/20 p-8 fixed top-[60px] rounded-b-lg shadow-lg z-40">
          <ul className="flex flex-col items-center space-y-8">
            <li><a href="#" className="text-white hover:text-gray-400">Home</a></li>
            <li><a href="#" className="text-white hover:text-gray-400">About</a></li>
            <li><a href="#" className="text-white hover:text-gray-400">Projects</a></li>
            <li><a href="#" className="text-white hover:text-gray-400">Blog</a></li>
          </ul>
        </nav>
      )}

      {/* Main Content */}
      <main className="p-12 text-center text-black min-h-[400px]">
        <h1 className="text-2xl font-bold">Welcome to my personal website</h1>
        <p className="mt-4">This is a simple navigation bar example using Tailwind CSS in Next.js.</p>
      </main>
    </div>
  );
}
