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
  imageUrl?: string[];
  videoUrl?: string | string[];
};

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      price: item.price, // Already in cents
      imageUrl: imageUrl,
    });

    toast.success("Added to cart!");
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
                  Earth Elements
                </h2>
                <p className="text-[#1C3163] text-[14px] sm:text-[16px] md:text-[18px] font-light">
                  Private Sessions & <br /> Corporate Wellness
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
                  Loading products...
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 text-[#1C3163]">
                  No products available
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-[18px] w-full">
                  {products.map((item) => {
                    // Get first image or use placeholder
                    const imageUrl = item.imageUrl && item.imageUrl.length > 0 
                      ? item.imageUrl[0] 
                      : null;
                    // Convert price from cents to rupees
                    const priceInRupees = (item.price / 100).toFixed(2);
                    
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
                        <div className="items-end justify-between  flex ">
                          <div className="w-full">
                            <p className="pt-4 sm:pt-6 md:pt-[28px] text-[14px] sm:text-[16px] md:text-[18px]">
                              {item.name}
                            </p>
                            <p className="text-[12px]   w-full flex items-center justify-between sm:text-[13px] md:text-[14px]">
                              {item.description || "Premium product"}{" "}
                              <span>
                                <button
                                  onClick={(e) => handleAddToCart(e, item)}
                                  className="border rounded-full p-1 hover:bg-[#1C3163] hover:text-white transition-colors cursor-pointer"
                                  aria-label="Add to cart"
                                >
                                  <Plus size={16} />
                                </button>
                              </span>
                            </p>
                            <p className="pt-3 sm:pt-4 md:pt-[18px] text-[10px] sm:text-[11px] md:text-[12px]">
                              ₹{priceInRupees}
                            </p>
                          </div>
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
