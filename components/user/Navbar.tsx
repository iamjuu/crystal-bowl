'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CryselLogo } from '@/public/assets'
import { ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/stores/useCart'

// Navigation items array
const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop', hasDropdown: true },
  { href: '/services', label: 'Offering', hasOfferingDropdown: true },
  { href: '/about', label: 'About Us' },
  // { href: '/events', label: 'Events' },
  // { href: '/blog', label: 'Blog' },
  // { href: '/book', label: 'Book' },
]

type Category = {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  isFeatured?: boolean;
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { totalQuantity, items } = useCart() // Subscribe to items to trigger re-render
  const [cartCount, setCartCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isShopHovered, setIsShopHovered] = useState(false)
  const [isOfferingHovered, setIsOfferingHovered] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const [dropdownTop, setDropdownTop] = useState(0)
  const shopHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const offeringHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        if (data.success) {
          setCategories(data.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    
    if (mounted) {
      fetchCategories()
    }
  }, [mounted])

  // Only render cart count after hydration to prevent mismatch
  useEffect(() => {
    setMounted(true)
    // Check login status after mount to prevent hydration mismatch
    setIsLoggedIn(!!localStorage.getItem("userToken"))
  }, [])

  // Update cart count whenever items change
  useEffect(() => {
    if (mounted) {
      setCartCount(totalQuantity())
    }
  }, [items, mounted, totalQuantity]) // Depend on items array to detect changes

  // Calculate dropdown position
  useEffect(() => {
    if (isShopHovered && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect()
      setDropdownTop(navRect.bottom)
    }
  }, [isShopHovered])


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
    }, 150)
  }

  const handleCartNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    // If already on cart page, just refresh
    if (pathname === '/cart') {
      window.location.reload()
      return
    }

    setIsNavigating(true)
    setIsMobileMenuOpen(false)

    // Check login status and route accordingly
    const targetPath = isLoggedIn ? '/cart' : '/login'
    
    setTimeout(() => {
      router.push(targetPath)
    }, 150)
  }

  return (
    <>
      {/* Page Transition Overlay */}
      <div 
        className={`fixed inset-0 bg-linear-to-br from-[#FDECE2] via-[#FEC1A2] to-[#D5B584] z-9999 pointer-events-none transition-all duration-300 ease-in-out ${
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

      <nav ref={navRef} className="w-full px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-[43px] relative">
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
            {navigationItems.map((item) => {
              // Handle Shop with dropdown
              if (item.hasDropdown) {
                return (
                  <div 
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => {
                      if (shopHoverTimeoutRef.current) {
                        clearTimeout(shopHoverTimeoutRef.current)
                        shopHoverTimeoutRef.current = null
                      }
                      setIsShopHovered(true)
                    }}
                    onMouseLeave={() => {
                      shopHoverTimeoutRef.current = setTimeout(() => {
                        setIsShopHovered(false)
                      }, 100)
                    }}
                  >
                    <Link 
                      href={item.href} 
                      onClick={(e) => handleNavigation(e, item.href)}
                      className={`group relative text-[#D5B584] hover:text-white transition-all duration-150 text-sm xl:text-base font-normal whitespace-nowrap hover:scale-110 overflow-hidden ${
                        pathname === item.href || pathname.startsWith('/shop') ? 'text-white font-semibold scale-110' : ''
                      }`}
                    >
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                    
                    {/* Shop Dropdown Menu - Narrow Vertical */}
                    {isShopHovered && (
                      <div 
                        className="absolute left-0 top-full mt-2 w-48 bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 rounded-lg z-50 pointer-events-auto py-2" 
                        onMouseEnter={() => {
                          if (shopHoverTimeoutRef.current) {
                            clearTimeout(shopHoverTimeoutRef.current)
                            shopHoverTimeoutRef.current = null
                          }
                          setIsShopHovered(true)
                        }}
                        onMouseLeave={() => {
                          shopHoverTimeoutRef.current = setTimeout(() => {
                            setIsShopHovered(false)
                          }, 100)
                        }}
                      >
                        <div className="flex flex-col">
                          {/* All Products Option */}
                          <Link
                            href="/shop?category=all"
                            onClick={(e) => {
                              // Don't use handleNavigation for same-page navigation
                              setIsShopHovered(false)
                            }}
                            className="text-[#1C3163] hover:text-[#D5B584] transition-all duration-150 text-sm xl:text-base font-normal py-2 px-4 hover:translate-x-2 cursor-pointer"
                          >
                            All Products
                          </Link>
                          {/* Dynamic Categories */}
                          {categories.slice(0, 8).map((category) => (
                            <Link
                              key={category._id}
                              href={`/shop?category=${category.slug}`}
                              onClick={(e) => {
                                // Don't use handleNavigation for query param changes (same page)
                                // Just close the dropdown and let the link navigate
                                setIsShopHovered(false)
                              }}
                              className="text-[#1C3163] hover:text-[#D5B584] transition-all duration-150 text-sm xl:text-base font-normal py-2 px-4 hover:translate-x-2 cursor-pointer"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }
              
              // Handle Offering with dropdown
              if (item.hasOfferingDropdown) {
                return (
                  <div 
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => {
                      if (offeringHoverTimeoutRef.current) {
                        clearTimeout(offeringHoverTimeoutRef.current)
                        offeringHoverTimeoutRef.current = null
                      }
                      setIsOfferingHovered(true)
                    }}
                    onMouseLeave={() => {
                      offeringHoverTimeoutRef.current = setTimeout(() => {
                        setIsOfferingHovered(false)
                      }, 100)
                    }}
                  >
                    <Link 
                      href={item.href} 
                      onClick={(e) => handleNavigation(e, item.href)}
                      className={`group relative text-[#D5B584] hover:text-white transition-all duration-150 text-sm xl:text-base font-normal whitespace-nowrap hover:scale-110 overflow-hidden ${
                        pathname === item.href || pathname.startsWith('/services') || pathname.startsWith('/events') ? 'text-white font-semibold scale-110' : ''
                      }`}
                    >
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                    
                    {/* Offering Dropdown Menu */}
                    {isOfferingHovered && (
                      <div 
                        className="absolute left-0 top-full mt-2 w-48 bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 rounded-lg z-50 pointer-events-auto py-2" 
                        onMouseEnter={() => {
                          if (offeringHoverTimeoutRef.current) {
                            clearTimeout(offeringHoverTimeoutRef.current)
                            offeringHoverTimeoutRef.current = null
                          }
                          setIsOfferingHovered(true)
                        }}
                        onMouseLeave={() => {
                          offeringHoverTimeoutRef.current = setTimeout(() => {
                            setIsOfferingHovered(false)
                          }, 100)
                        }}
                      >
                        <div className="flex flex-col">
                          <Link
                            href="/events"
                            onClick={(e) => {
                              handleNavigation(e, '/events')
                              setIsOfferingHovered(false)
                            }}
                            className="text-[#1C3163] hover:text-[#D5B584] transition-all duration-150 text-sm xl:text-base font-normal py-2 px-4 hover:translate-x-2 cursor-pointer"
                          >
                            Events
                          </Link>
                          <Link
                            href="/services"
                            onClick={(e) => {
                              handleNavigation(e, '/services')
                              setIsOfferingHovered(false)
                            }}
                            className="text-[#1C3163] hover:text-[#D5B584] transition-all duration-150 text-sm xl:text-base font-normal py-2 px-4 hover:translate-x-2 cursor-pointer"
                          >
                            Services
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }
              
              // Regular navigation items
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  onClick={(e) => handleNavigation(e, item.href)}
                  className={`group relative text-[#D5B584] hover:text-white transition-all duration-150 text-sm xl:text-base font-normal whitespace-nowrap hover:scale-110 overflow-hidden ${
                    pathname === item.href ? 'text-white font-semibold scale-110' : ''
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                </Link>
              )
            })}
            <Link 
              href="/book-a-session" 
              onClick={(e) => handleNavigation(e, '/book-a-session')}
              className={`group relative text-[#D5B584] hover:text-white transition-all duration-150 text-sm xl:text-base font-normal whitespace-nowrap hover:scale-110 overflow-hidden ${
                pathname === '/book-a-session' ? 'text-white font-semibold scale-110' : ''
              }`}
            >
              <span className="relative z-10">Book a Call</span>
            </Link>
            
            {/* Profile Icon - Always visible */}
            <Link 
              href="/profile" 
              onClick={(e) => handleNavigation(e, '/profile')}
              className={`relative text-[#D5B584] hover:text-white transition-all duration-150 hover:scale-110 ${
                pathname === '/profile' ? 'text-white scale-110' : ''
              }`}
            >
              <User size={24} />
            </Link>
            
            {/* Cart Icon */}
            <Link 
              href={isLoggedIn ? "/cart" : "/login"} 
              onClick={handleCartNavigation}
              className="relative text-[#D5B584] hover:text-white transition-all duration-150 hover:scale-110"
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
            {/* Profile Icon Mobile - Always visible */}
            <Link 
              href="/profile" 
              onClick={(e) => handleNavigation(e, '/profile')}
              className={`relative text-[#D5B584] hover:text-white transition-all duration-150 ${
                pathname === '/profile' ? 'text-white' : ''
              }`}
            >
              <User size={24} />
            </Link>
            
            {/* Cart Icon Mobile */}
            <Link 
              href={isLoggedIn ? "/cart" : "/login"} 
              onClick={handleCartNavigation}
              className="relative text-[#D5B584] hover:text-white transition-all duration-150"
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
              className="text-[#D5B584] hover:text-white transition-colors duration-150 p-2"
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
          className={`lg:hidden bg-black/15 backdrop-blur-sm overflow-hidden transition-all duration-150 ease-in-out ${
            isMobileMenuOpen ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-4 py-4 px-2">
            {navigationItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={(e) => handleNavigation(e, item.href)}
                className={`group relative text-[#D5B584] hover:text-white transition-all duration-150 text-base font-normal py-2 px-4 hover:bg-white/5 rounded hover:translate-x-2 overflow-hidden ${
                  pathname === item.href || (item.href === '/shop' && pathname.startsWith('/shop')) || (item.href === '/services' && (pathname.startsWith('/services') || pathname.startsWith('/events'))) ? 'bg-white/10 text-white font-semibold translate-x-2' : ''
                }`}
              >
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
            <Link 
              href="/book-a-session" 
              onClick={(e) => handleNavigation(e, '/book-a-session')}
              className={`group relative text-[#D5B584] hover:text-white transition-all duration-150 text-base font-normal py-2 px-4 hover:bg-white/5 rounded hover:translate-x-2 overflow-hidden ${
                pathname === '/book-a-session' ? 'bg-white/10 text-white font-semibold translate-x-2' : ''
              }`}
            >
              <span className="relative z-10">Book a Call</span>
            </Link>
          </div>
        </div>
      </div>
      </nav>
    </>
  )
}

export default Navbar

