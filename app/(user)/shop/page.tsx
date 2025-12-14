"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import Image from "next/image";
import { Plus } from "lucide-react";
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
        
        // Build API URL with category filter
        let apiUrl = "/api/products";
        if (categoryParam && categoryParam !== "all") {
          apiUrl += `?category=${encodeURIComponent(categoryParam)}`;
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
  }, [categoryParam]); // Use stable category param value

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
          <div className="max-w-6xl items-center flex flex-col mx-auto px-4">
            {/* Header */}
            <div className="mb-8 items-center   w-full md:mb-12 flex flex-col justify-between sm:flex-row gap-4 sm:gap-8 md:gap-[62px]">
              <div className="flex  items-center gap-[50px]">
                <h2 className="text-[#D5B584] text-[28px] sm:text-[32px] md:text-[40px] font-normal">
                  {categoryName}
                </h2>
                <p className="text-[#1C3163] text-[14px] sm:text-[16px] md:text-[18px] font-light">
                  {categoryName === "All Products" 
                    ? "Private Sessions & Corporate Wellness"
                    : "Browse our collection"}
                </p>
              </div>
              <div className="flex p-[6px] rounded-[6px] gap-4  border">
                <button className="border-r border-r-gray-300 pr-4">
                  <Image src={FliterIcon} alt="filter" />
                </button>

                <button>
                  <Image src={SortIcon} alt="sort" />
                </button>
              </div>
            </div>
            <div className="flex  w-full bg-amber-100flex-col gap-12 md:gap-16 lg:gap-[80px]">
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
                    // Price is already in rupees
                    const priceInRupees = item.price.toFixed(2);
                    
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
                              ${priceInRupees}
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
        </section>
      </>

      <Footer />
    </div>
  );
};

export default ShopPage;
