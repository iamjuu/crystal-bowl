'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CryselLogo } from '@/public/assets'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="w-full px-4 sm:px-6 lg:px-8 pt-[43px]">
      <div className="max-w-[1400px] mx-auto">
        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-[60px] xl:gap-[100px] justify-center items-center">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image 
                src={CryselLogo} 
                alt="Crystal Bowl Studio Logo" 
                width={200}
                height={40}
                className="h-8 xl:h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-[40px] xl:gap-[68px] flex-wrap justify-center">
            <Link href="/" className="text-[#D5B584] hover:text-white transition-colors duration-300 text-sm xl:text-base font-normal whitespace-nowrap">
              Home
            </Link>
            <Link href="/about" className="text-[#D5B584] hover:text-white transition-colors duration-300 text-sm xl:text-base font-normal whitespace-nowrap">
              About Us
            </Link>
            <Link href="/services" className="text-[#D5B584] hover:text-white transition-colors duration-300 text-sm xl:text-base font-normal whitespace-nowrap">
              Services
            </Link>
            <Link href="/shop" className="text-[#D5B584] hover:text-white transition-colors duration-300 text-sm xl:text-base font-normal whitespace-nowrap">
              Shop
            </Link>
            <Link href="/events" className="text-[#D5B584] hover:text-white transition-colors duration-300 text-sm xl:text-base font-normal whitespace-nowrap">
              Events
            </Link>
            <Link href="/blog" className="text-[#D5B584] hover:text-white transition-colors duration-300 text-sm xl:text-base font-normal whitespace-nowrap">
              Blog
            </Link>
            <Link 
              href="/book" 
              className="text-[#D5B584] px-4 xl:px-6 py-2 rounded hover:bg-white hover:text-black transition-colors duration-300 text-sm xl:text-base font-normal whitespace-nowrap"
            >
              Book a Session
            </Link>
          </div>
        </div>

        {/* Tablet & Mobile Layout */}
        <div className="lg:hidden flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src={CryselLogo} 
              alt="Crystal Bowl Studio Logo" 
              width={160}
              height={32}
              className="h-8 sm:h-10 w-auto"
              priority
            />
          </Link>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="text-[#D5B584] hover:text-white transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div 
          className={`lg:hidden bg-black/40 overflow-hidden absolute  transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-4 pb-6">
            <Link 
              href="/" 
              className="text-[#D5B584] hover:text-white transition-colors duration-300 text-base font-normal py-2 px-4 hover:bg-white/5 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-[#D5B584] hover:text-white transition-colors duration-300 text-base font-normal py-2 px-4 hover:bg-white/5 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              href="/services" 
              className="text-[#D5B584] hover:text-white transition-colors duration-300 text-base font-normal py-2 px-4 hover:bg-white/5 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/shop" 
              className="text-[#D5B584] hover:text-white transition-colors duration-300 text-base font-normal py-2 px-4 hover:bg-white/5 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              href="/events" 
              className="text-[#D5B584] hover:text-white transition-colors duration-300 text-base font-normal py-2 px-4 hover:bg-white/5 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              href="/blog" 
              className="text-[#D5B584] hover:text-white transition-colors duration-300 text-base font-normal py-2 px-4 hover:bg-white/5 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <div className='p-2'>
            <Link 
              href="/book" 
              className="text-[#D5B584]  border border-[#D5B584] px-6 py-3 rounded hover:bg-white hover:text-black transition-colors duration-300 text-base font-normal text-center mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book a Session
            </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
