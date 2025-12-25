"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import Image from "next/image";
import { Plus, ChevronDown, X } from "lucide-react";
import {
  Bucket1,
  FliterIcon,
  SortIcon
} from "@/public/assets";
import Link from "next/link";
import { useCart } from "@/stores/useCart";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Product = {
  _id: string;
  name: string;
  price: number;
  createdAt: string;
  description?: string;
  category?: string | { _id: string; name: string; slug: string };
  imageUrl?: string[];
  videoUrl?: string | string[];
};

type Category = {
  _id: string;
  name: string;
  slug: string;
};

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>("All Products");
  const { addItem } = useCart();
  const router = useRouter();
  
  // Get category from URL using window.location (avoid useSearchParams Suspense issue)
  const [categoryParam, setCategoryParam] = useState<string | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    featured: false,
    newAddition: false,
    weight: "",
    octave: "",
    size: "",
    tuning: "",
    sortBy: "",
    sortOrder: "asc",
  });
  
  // Filter panel visibility
  const [showFilters, setShowFilters] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  
  // Close filters when category changes
  useEffect(() => {
    setShowFilters(false);
  }, [categoryParam]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortDropdown]);
  
  // Get sort label
  const getSortLabel = () => {
    if (filters.featured) return "FEATURED";
    if (filters.newAddition) return "NEW ADDITION";
    if (filters.sortBy === "price" && filters.sortOrder === "desc") return "PRICE, HIGH TO LOW";
    if (filters.sortBy === "price" && filters.sortOrder === "asc") return "PRICE, LOW TO HIGH";
    if (filters.sortBy === "name" && filters.sortOrder === "asc") return "ALPHABETICALLY, A-Z";
    if (filters.sortBy === "name" && filters.sortOrder === "desc") return "ALPHABETICALLY, Z-A";
    return "SORT PRODUCTS";
  };
  
  const handleSortChange = (sortBy: string, sortOrder: string) => {
    if (sortBy === "featured") {
      setFilters({ ...filters, featured: true, newAddition: false, sortBy: "", sortOrder: "asc" });
    } else if (sortBy === "newAddition") {
      setFilters({ ...filters, newAddition: true, featured: false, sortBy: "", sortOrder: "asc" });
    } else {
      setFilters({ ...filters, sortBy, sortOrder, featured: false, newAddition: false });
    }
    setShowSortDropdown(false);
  };

  // Parse URL on client side and listen for changes
  useEffect(() => {
    const updateCategoryFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const category = urlParams.get("category");
      setCategoryParam(category);
    };

    // Initial load
    updateCategoryFromUrl();

    // Poll for URL changes every 100ms (to catch Next.js Link navigation)
    const intervalId = setInterval(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const currentCategory = urlParams.get("category");
      setCategoryParam(prev => {
        if (prev !== currentCategory) {
          return currentCategory;
        }
        return prev;
      });
    }, 100);

    // Also listen for URL changes (for browser back/forward)
    window.addEventListener('popstate', updateCategoryFromUrl);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('popstate', updateCategoryFromUrl);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Build API URL with category and filters
        let apiUrl = "/api/products";
        const params = new URLSearchParams();
        
        if (categoryParam && categoryParam !== "all") {
          params.append("category", categoryParam);
        }
        
        // Add filters
        if (filters.featured) {
          params.append("featured", "true");
        }
        if (filters.newAddition) {
          params.append("newAddition", "true");
        }
        if (filters.weight) {
          params.append("weight", filters.weight);
        }
        if (filters.octave) {
          params.append("octave", filters.octave);
        }
        if (filters.size) {
          params.append("size", filters.size);
        }
        if (filters.tuning) {
          params.append("tuning", filters.tuning);
        }
        if (filters.sortBy) {
          params.append("sortBy", filters.sortBy);
          params.append("sortOrder", filters.sortOrder);
        }
        
        if (params.toString()) {
          apiUrl += `?${params.toString()}`;
        }

        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        timeoutId = setTimeout(() => {
          controller.abort();
        }, 5000); // 5 second timeout

        const response = await fetch(apiUrl, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Always set products, even if empty array
        if (isMounted) {
          setProducts(data.data || []);
        }
        
        // Set category name immediately with a default, then try to fetch the real name
        if (categoryParam && categoryParam !== "all") {
          // Set a default first
          if (isMounted) {
            setCategoryName(categoryParam);
          }
          
          // Then try to fetch the real category name (non-blocking)
          fetch("/api/categories")
            .then((categoryResponse) => categoryResponse.json())
            .then((categoryData) => {
              if (categoryData.success && isMounted) {
                const category = categoryData.data.find(
                  (cat: Category) => {
                    const slugMatch = cat.slug === categoryParam;
                    const nameSlugMatch = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === categoryParam;
                    return slugMatch || nameSlugMatch;
                  }
                );
                if (isMounted && category) {
                  setCategoryName(category.name);
                }
              }
            })
            .catch((catError) => {
              console.error("Failed to fetch category name:", catError);
            });
        } else {
          if (isMounted) {
            setCategoryName("All Products");
          }
        }
      } catch (error: any) {
        console.error("Failed to fetch products:", error);
        if (isMounted) {
          setProducts([]);
          setCategoryName(categoryParam && categoryParam !== "all" ? (categoryParam || "Category") : "All Products");
        }
      } finally {
        // Always clear loading state immediately
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      // Force loading to false on cleanup to prevent stuck state
      setLoading(false);
    };
  }, [categoryParam, filters]); // Re-fetch when category or filters change

  // Helper function to normalize image URL
  const normalizeImageUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("data:image")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `data:image/jpeg;base64,${url}`;
  };

  // Handle Add to Cart
  const handleAddToCart = (e: React.MouseEvent, item: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    // Get first image URL for cart
    const imageUrl = item.imageUrl && item.imageUrl.length > 0 
      ? normalizeImageUrl(item.imageUrl[0])
      : "";

    addItem({
      id: item._id,
      name: item.name,
      price: item.price, // Price in rupees/dollars
      imageUrl: imageUrl,
    });

    toast.success("Added to cart!");
  };

  // Toggle expanded state for description
  const toggleExpanded = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <div className=' bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen'>
      <Navbar />

      <>
        <section className="w-full py-[40px] md:py-[68px] ">
          <div className="max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="mb-8 md:mb-12">
              <div className="flex items-center gap-[50px] mb-6">
                <h2 className="text-[#D5B584] text-[28px] sm:text-[32px] md:text-[40px] font-normal">
                  {categoryName}
                </h2>
                <p className="text-[#1C3163] text-[14px] sm:text-[16px] md:text-[18px] font-light">
                  {categoryName === "All Products" 
                    ? "Private Sessions & Corporate Wellness"
                    : "Browse our collection"}
                </p>
              </div>
              
              {/* Top Bar with HIDE FILTERS and Sort */}
              <div className="flex justify-between items-center bg-gray-100 p-2 mb-4">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-sm font-medium text-[#1C3163] hover:opacity-80 transition-opacity"
                >
                  <Image src={FliterIcon} alt="filter" className="w-4 h-4" />
                  {showFilters ? "HIDE FILTERS" : "SHOW FILTERS"}
                </button>

                {/* Sort Dropdown */}
                <div className="relative" ref={sortDropdownRef}>
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 text-sm font-medium text-[#1C3163] hover:opacity-80 transition-opacity"
                  >
                    <Image src={SortIcon} alt="sort" className="w-4 h-4" />
                    {getSortLabel()}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showSortDropdown && (
                    <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[220px]">
                      <button
                        onClick={() => handleSortChange("featured", "asc")}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          filters.featured ? 'underline' : ''
                        }`}
                      >
                        FEATURED
                      </button>
                      <button
                        onClick={() => handleSortChange("newAddition", "asc")}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          filters.newAddition ? 'underline' : ''
                        }`}
                      >
                        NEW ADDITION
                      </button>
                      <button
                        onClick={() => handleSortChange("name", "asc")}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          filters.sortBy === "name" && filters.sortOrder === "asc" ? 'underline' : ''
                        }`}
                      >
                        ALPHABETICALLY, A-Z
                      </button>
                      <button
                        onClick={() => handleSortChange("name", "desc")}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          filters.sortBy === "name" && filters.sortOrder === "desc" ? 'underline' : ''
                        }`}
                      >
                        ALPHABETICALLY, Z-A
                      </button>
                      <button
                        onClick={() => handleSortChange("price", "asc")}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          filters.sortBy === "price" && filters.sortOrder === "asc" ? 'underline' : ''
                        }`}
                      >
                        PRICE, LOW TO HIGH
                      </button>
                      <button
                        onClick={() => handleSortChange("price", "desc")}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          filters.sortBy === "price" && filters.sortOrder === "desc" ? 'underline' : ''
                        }`}
                      >
                        PRICE, HIGH TO LOW
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Filter Sidebar - Left */}
              {showFilters && (
                <div className="w-full lg:w-64 shrink-0 bg-white rounded-lg p-6 shadow-lg">
                  <div className="space-y-6">
                    {/* All Collections Heading */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#1C3163]">ALL COLLECTIONS</h3>
                      <ChevronDown className="w-5 h-5 text-[#1C3163]" />
                    </div>
                    
                    {/* Filter Options */}
                    <div className="space-y-3">
                      {/* Weight Options */}
                      <div className="space-y-2 pt-2">
                        <h4 className="text-sm font-medium text-[#1C3163]">Weight</h4>
                        {["less than 1kg", "less than 6kg", "between 1-3kg", "3-5kg"].map((weight) => (
                          <label key={weight} className="flex items-center justify-between cursor-pointer py-1">
                            <span className="text-sm text-[#1C3163]">{weight}</span>
                            <input
                              type="checkbox"
                              checked={filters.weight === weight}
                              onChange={(e) => setFilters({ ...filters, weight: e.target.checked ? weight : "" })}
                              className="w-4 h-4 text-[#1C3163] border-gray-300 rounded focus:ring-[#1C3163]"
                            />
                          </label>
                        ))}
                      </div>
                      
                      {/* Octave Options */}
                      <div className="space-y-2 pt-2">
                        <h4 className="text-sm font-medium text-[#1C3163]">Octave</h4>
                        {["3rd octave", "4th octave"].map((octave) => (
                          <label key={octave} className="flex items-center justify-between cursor-pointer py-1">
                            <span className="text-sm text-[#1C3163]">{octave}</span>
                            <input
                              type="checkbox"
                              checked={filters.octave === octave}
                              onChange={(e) => setFilters({ ...filters, octave: e.target.checked ? octave : "" })}
                              className="w-4 h-4 text-[#1C3163] border-gray-300 rounded focus:ring-[#1C3163]"
                            />
                          </label>
                        ))}
                      </div>
                      
                      {/* Size Options */}
                      <div className="space-y-2 pt-2">
                        <h4 className="text-sm font-medium text-[#1C3163]">Size</h4>
                        {["5-6", "6-7", "7-8", "8"].map((size) => (
                          <label key={size} className="flex items-center justify-between cursor-pointer py-1">
                            <span className="text-sm text-[#1C3163]">{size}</span>
                            <input
                              type="checkbox"
                              checked={filters.size === size}
                              onChange={(e) => setFilters({ ...filters, size: e.target.checked ? size : "" })}
                              className="w-4 h-4 text-[#1C3163] border-gray-300 rounded focus:ring-[#1C3163]"
                            />
                          </label>
                        ))}
                      </div>
                      
                      {/* Tuning Options */}
                      <div className="space-y-2 pt-2">
                        <h4 className="text-sm font-medium text-[#1C3163]">Tuning</h4>
                        {["432", "440", "528"].map((tuning) => (
                          <label key={tuning} className="flex items-center justify-between cursor-pointer py-1">
                            <span className="text-sm text-[#1C3163]">{tuning} HZ TUNING</span>
                            <input
                              type="checkbox"
                              checked={filters.tuning === tuning}
                              onChange={(e) => setFilters({ ...filters, tuning: e.target.checked ? tuning : "" })}
                              className="w-4 h-4 text-[#1C3163] border-gray-300 rounded focus:ring-[#1C3163]"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Products Grid - Right */}
              <div className="flex-1">
              {loading ? (
                <div className="text-center py-12 text-[#1C3163]">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1C3163] mx-auto mb-4"></div>
                  <p>Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 text-[#1C3163]">
                  {categoryParam && categoryParam !== "all"
                    ? "No products for this category"
                    : "No products available"}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-[18px] w-full">
                  {products.map((item) => {
                    // Get first image or use placeholder
                    const imageUrl = item.imageUrl && item.imageUrl.length > 0 
                      ? item.imageUrl[0] 
                      : null;
                    // Price is already in dollars - format to show decimals only if needed
                    const formatPrice = (price: number) => {
                      const rounded = Math.round(price * 100) / 100;
                      if (rounded % 1 === 0) {
                        return `$${rounded}`;
                      }
                      return `$${rounded.toFixed(2)}`;
                    };
                    const priceInRupees = formatPrice(item.price);
                    
                    return (
                      <Link 
                        href={`/shop/${item._id}`} 
                        key={item._id} 
                        className="text-black group cursor-pointer"
                      >
                        <div className="relative w-full aspect-square">
                          {imageUrl ? (
                            <Image
                              src={imageUrl.startsWith("data:") || imageUrl.startsWith("http") 
                                ? imageUrl 
                                : `data:image/jpeg;base64,${imageUrl}`}
                              alt={item.name}
                              fill
                              className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                              unoptimized
                            />
                          ) : (
                            <Image
                              src={Bucket1}
                              alt={item.name}
                              fill
                              className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                        </div>
                        <div className="items-end justify-between flex ">
                          <div className="w-full">
                            <p className="pt-4 sm:pt-6 md:pt-[28px] text-[14px] sm:text-[16px] md:text-[18px]">
                              {item.name}
                            </p>
                            <p className="pt-3 sm:pt-4 md:pt-[18px] text-[10px] sm:text-[11px] md:text-[12px]">
                              {priceInRupees}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleAddToCart(e, item)}
                            className="border rounded-full p-1 hover:bg-[#1C3163] hover:text-white transition-colors cursor-pointer"
                            aria-label="Add to cart"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
              </div>
            </div>
          </div>
        </section>
      </>

      <Footer />
    </div>
  );
};

export default ShopPage;
