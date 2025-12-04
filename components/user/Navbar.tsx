'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CryselLogo } from '@/public/assets'
import { ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/stores/useCart'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { totalQuantity } = useCart()
  const [cartCount, setCartCount] = useState(0)

  // Only render cart count after hydration to prevent mismatch
  useEffect(() => {
    setMounted(true)
    // Check if user is logged in
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    setIsLoggedIn(!!token)
  }, [])

  // Update cart count on client side only
  useEffect(() => {
    if (mounted) {
      setCartCount(totalQuantity())
    }
  }, [totalQuantity, mounted])

  // Listen for login/logout changes
  useEffect(() => {
    if (!mounted) return

    const checkAuth = () => {
      const token = localStorage.getItem("token")
      setIsLoggedIn(!!token)
    }

    // Check on storage changes (logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        checkAuth()
      }
    }

    // Check on custom logout event
    const handleLogout = () => {
      checkAuth()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("logout", handleLogout)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("logout", handleLogout)
    }
  }, [mounted])

  // Check auth state when pathname changes (e.g., after login redirect)
  useEffect(() => {
    if (mounted) {
      const token = localStorage.getItem("token")
      setIsLoggedIn(!!token)
    }
  }, [pathname, mounted])


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Close mobile menu when route changes
  useEffect(() => {
    // Use a microtask to avoid synchronous state updates
    Promise.resolve().then(() => {
      setIsMobileMenuOpen(false)
      setIsNavigating(false)
    })
  }, [pathname])

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Don't animate if already on the page
    if (pathname === href) {
      e.preventDefault()
      return
    }

    e.preventDefault()
    setIsNavigating(true)
    setIsMobileMenuOpen(false)

    // Delay navigation for smooth animation
    setTimeout(() => {
      router.push(href)
    }, 300)
  }

  return (
    <>
      {/* Page Transition Overlay */}
      <div 
        className={`fixed inset-0 bg-linear-to-br from-[#FDECE2] via-[#FEC1A2] to-[#D5B584] z-9999 pointer-events-none transition-all duration-500 ease-in-out ${
          isNavigating 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95'
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Animated Crystal Bowl Icon */}
            <div className="w-20 h-20 rounded-full border-4 border-white/30 border-t-white animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <nav className="w-full px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-[43px]">
        <div className="max-w-[1400px] mx-auto">
        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-8 xl:gap-[60px] 2xl:gap-[100px] justify-center items-center flex-wrap">
          {/* Logo Section */}
          <div className="flex items-center shrink-0">
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
          <div className="flex items-center gap-6 lg:gap-8 xl:gap-[40px] 2xl:gap-[68px] flex-wrap justify-center">
            <Link 
              href="/" 
              onClick={(e) => handleNavigation(e, '/')}
              className={`text-[#D5B584] hover:text-white transition-all duration-300 text-sm xl:text-base font-normal whitespace-nowrap hover:scale-110 ${
                pathname === '/' ? 'text-white font-semibold scale-110' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              onClick={(e) => handleNavigation(e, '/about')}
              className={`text-[#D5B584] hover:text-white transition-all duration-300 text-sm xl:text-base font-normal whitespace-nowrap hover:scale-110 ${
                pathname === '/about' ? 'text-white font-semibold scale-110' : ''
              }`}
            >
              About Us
            </Link>
            <Link 
              href="/services" 
              onClick={(e) => handleNavigation(e, '/services')}
              className={`text-[#D5B584] hover:text-white transition-all duration-300 text-sm xl:text-base font-normal whitespace-nowrap hover:scale-110 ${
                pathname === '/services' ? 'text-white font-semibold scale-110' : ''
              }`}
            >
              Services
            </Link>
            <Link 
              href="/shop" 
              onClick={(e) => handleNavigation(e, '/shop')}
              className={`text-[#D5B584] hover:text-white transition-all duration-300 text-sm xl:text-base font-normal whitespace-nowrap hover:scale-110 ${
                pathname === '/shop' ? 'text-white font-semibold scale-110' : ''
              }`}
            >
              Shop
            </Link>
            <Link 
              href="/events" 
              onClick={(e) => handleNavigation(e, '/events')}
              className={`text-[#D5B584] hover:text-white transition-all duration-300 text-sm xl:text-base font-normal whitespace-nowrap hover:scale-110 ${
                pathname === '/events' ? 'text-white font-semibold scale-110' : ''
              }`}
            >
              Events
            </Link>
            <Link 
              href="/blog" 
              onClick={(e) => handleNavigation(e, '/blog')}
              className={`text-[#D5B584] hover:text-white transition-all duration-300 text-sm xl:text-base font-normal whitespace-nowrap hover:scale-110 ${
                pathname === '/blog' ? 'text-white font-semibold scale-110' : ''
              }`}
            >
              Blog
            </Link>
            <Link 
              href="/book" 
              onClick={(e) => handleNavigation(e, '/book')}
              className={`text-[#D5B584] border border-[#D5B584] px-4 xl:px-6 py-2 rounded hover:bg-white hover:text-black transition-all duration-300 text-sm xl:text-base font-normal whitespace-nowrap hover:scale-105 hover:shadow-lg ${
                pathname === '/book' ? 'bg-white text-black scale-105 shadow-lg' : ''
              }`}
            >
              Book a Session
            </Link>
            
            {/* Profile Icon */}
            {mounted && isLoggedIn && (
              <Link 
                href="/profile" 
                onClick={(e) => handleNavigation(e, '/profile')}
                className={`relative text-[#D5B584] hover:text-white transition-all duration-300 hover:scale-110 ${
                  pathname === '/profile' ? 'text-white scale-110' : ''
                }`}
              >
                <User size={24} />
              </Link>
            )}
            
            {/* Cart Icon */}
            <Link 
              href="/cart" 
              onClick={(e) => handleNavigation(e, '/cart')}
              className="relative text-[#D5B584] hover:text-white transition-all duration-300 hover:scale-110"
            >
              <ShoppingCart size={24} />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
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

          <div className="flex items-center gap-4">
            {/* Profile Icon Mobile */}
            {mounted && isLoggedIn && (
              <Link 
                href="/profile" 
                onClick={(e) => handleNavigation(e, '/profile')}
                className={`relative text-[#D5B584] hover:text-white transition-all duration-300 ${
                  pathname === '/profile' ? 'text-white' : ''
                }`}
              >
                <User size={24} />
              </Link>
            )}
            
            {/* Cart Icon Mobile */}
            <Link 
              href="/cart" 
              onClick={(e) => handleNavigation(e, '/cart')}
              className="relative text-[#D5B584] hover:text-white transition-all duration-300"
            >
              <ShoppingCart size={24} />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
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
        </div>

        {/* Mobile Menu Dropdown */}
        <div 
          className={`lg:hidden bg-black/15 backdrop-blur-sm overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-4 py-4 px-2">
            <Link 
              href="/" 
              onClick={(e) => handleNavigation(e, '/')}
              className={`text-[#D5B584] hover:text-white transition-all duration-300 text-base font-normal py-2 px-4 hover:bg-white/5 rounded hover:translate-x-2 ${
                pathname === '/' ? 'bg-white/10 text-white font-semibold translate-x-2' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              onClick={(e) => handleNavigation(e, '/about')}
              className={`text-[#D5B584] hover:text-white transition-all duration-300 text-base font-normal py-2 px-4 hover:bg-white/5 rounded hover:translate-x-2 ${
                pathname === '/about' ? 'bg-white/10 text-white font-semibold translate-x-2' : ''
              }`}
            >
              About Us
            </Link>
            <Link 
              href="/services" 
              onClick={(e) => handleNavigation(e, '/services')}
              className={`text-[#D5B584] hover:text-white transition-all duration-300 text-base font-normal py-2 px-4 hover:bg-white/5 rounded hover:translate-x-2 ${
                pathname === '/services' ? 'bg-white/10 text-white font-semibold translate-x-2' : ''
              }`}
            >
              Services
            </Link>
            <Link 
              href="/shop" 
              onClick={(e) => handleNavigation(e, '/shop')}
              className={`text-[#D5B584] hover:text-white transition-all duration-300 text-base font-normal py-2 px-4 hover:bg-white/5 rounded hover:translate-x-2 ${
                pathname === '/shop' ? 'bg-white/10 text-white font-semibold translate-x-2' : ''
              }`}
            >
              Shop
            </Link>
            <Link 
              href="/events" 
              onClick={(e) => handleNavigation(e, '/events')}
              className={`text-[#D5B584] hover:text-white transition-all duration-300 text-base font-normal py-2 px-4 hover:bg-white/5 rounded hover:translate-x-2 ${
                pathname === '/events' ? 'bg-white/10 text-white font-semibold translate-x-2' : ''
              }`}
            >
              Events
            </Link>
            <Link 
              href="/blog" 
              onClick={(e) => handleNavigation(e, '/blog')}
              className={`text-[#D5B584] hover:text-white transition-all duration-300 text-base font-normal py-2 px-4 hover:bg-white/5 rounded hover:translate-x-2 ${
                pathname === '/blog' ? 'bg-white/10 text-white font-semibold translate-x-2' : ''
              }`}
            >
              Blog
            </Link>
            <div className='px-2 pt-2'>
              <Link 
                href="/book" 
                onClick={(e) => handleNavigation(e, '/book')}
                className={`block text-[#D5B584] border border-[#D5B584] px-6 py-3 rounded hover:bg-white hover:text-black transition-all duration-300 text-base font-normal text-center hover:scale-105 hover:shadow-lg ${
                  pathname === '/book' ? 'bg-white text-black scale-105 shadow-lg' : ''
                }`}
              >
                Book a Session
              </Link>
            </div>
          </div>
        </div>
      </div>
      </nav>
    </>
  )
}

export default Navbar

