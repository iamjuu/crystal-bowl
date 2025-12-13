"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Bucket1 } from "@/public/assets";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/stores/useCart";
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

// Magnifier Component
const ImageMagnifier = ({ src, alt }: { src: string; alt: string }) => {
  const [magnifierStyle, setMagnifierStyle] = useState<React.CSSProperties>({});
  const [showMagnifier, setShowMagnifier] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const magnifierRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setShowMagnifier(true);
    updateMagnifier(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateMagnifier(e);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const updateMagnifier = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    // Position magnifier relative to viewport to avoid overflow clipping
    const magnifierX = e.clientX;
    const magnifierY = e.clientY;

    setMagnifierStyle({
      display: "block",
      left: `${magnifierX}px`,
      top: `${magnifierY}px`,
      backgroundImage: `url(${src})`,
      backgroundPosition: `${percentX}% ${percentY}%`,
      backgroundSize: "200%",
    });
  };

  return (
    <>
      <div
        ref={imgRef}
        className="relative w-full h-full cursor-zoom-in"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      {showMagnifier && (
        <div
          ref={magnifierRef}
          className="fixed pointer-events-none rounded-full shadow-2xl z-50"
          style={{
            ...magnifierStyle,
            width: "200px",
            height: "200px",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: "4px solid rgba(255, 255, 255, 0.9)",
            boxShadow: "0 0 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.1)",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
    </>
  );
};

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingNow, setBuyingNow] = useState(false);
  const { addItem } = useCart();

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      if (data.success) {
        setProduct(data.data);
      } else {
        router.push("/shop");
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      router.push("/shop");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=4");
      const data = await response.json();
      if (data.success) {
        // Filter out current product
        const filtered = data.data.filter((p: Product) => p._id !== productId);
        setRelatedProducts(filtered.slice(0, 4));
      }
    } catch (error) {
      console.error("Failed to fetch related products:", error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchRelatedProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Helper function to normalize image URL
  const normalizeImageUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("data:image")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `data:image/jpeg;base64,${url}`;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-2xl text-[#1C3163]">Loading product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-2xl text-[#1C3163]">Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Get product images (max 3) - ensure it's always an array
  const productImages = Array.isArray(product.imageUrl) && product.imageUrl.length > 0 
    ? product.imageUrl 
    : [];
  
  // Ensure selectedImage is within bounds
  const safeSelectedImage = productImages.length > 0 
    ? Math.min(Math.max(0, selectedImage), productImages.length - 1)
    : 0;
  
  // Get main image or placeholder
  const mainImage = productImages.length > 0 && productImages[safeSelectedImage]
    ? normalizeImageUrl(productImages[safeSelectedImage])
    : null;
  
  // Price is already in dollars
  const priceInDollars = product.price.toFixed(2);

  // Handle Add to Cart
  const handleAddToCart = () => {
    // Check if user is logged in
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    // Get first image URL for cart
    const imageUrl = productImages.length > 0 
      ? normalizeImageUrl(productImages[0])
      : "";

    addItem({
      id: product._id,
      name: product.name,
      price: product.price, // Price in dollars
      imageUrl: imageUrl,
    });

    toast.success("Added to cart!");
    router.push("/cart");
  };

  // Handle Instant Buy with Stripe
  const handleBuyNow = async () => {
    // Check if user is logged in
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login to proceed with purchase");
      router.push("/login");
      return;
    }

    setBuyingNow(true);

    try {
      const response = await fetch("/api/payment/instant-buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (data.success && data.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.data.url;
      } else {
        toast.error(data.message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Instant buy error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBuyingNow(false);
    }
  };

  return (
    <div className=" bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen]">
      <Navbar />

      <section className="w-full py-[40px] md:py-[68px]">
        <div className="max-w-6xl mx-auto px-4">
          {/* Product Detail Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 lg:mb-24">
            {/* Left Side - Images */}
            <div className="flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnail Images */}
              {Array.isArray(productImages) && productImages.length > 1 && (
                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
                  {productImages.map((imgUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-[#1C3163]"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={normalizeImageUrl(imgUrl)}
                        alt={`Product view ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <Image
                    src={Bucket1}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div className="flex flex-col">
              <h1 className="text-[#1C3163] text-[28px] sm:text-[32px] lg:text-[30px] font-normal mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="mb-6">
                <p className="text-[#1C3163] text-[24px] sm:text-[28px] lg:text-[32px] font-medium">
                  ${priceInDollars}
                </p>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                className="w-full bg-[#2C3E50] hover:bg-[#1C3163] text-white py-4 rounded-lg mb-4 transition-colors text-[16px] font-medium"
              >
                Add to Cart
              </button>

              {/* Buy Now with Stripe Button */}
              <button 
                onClick={handleBuyNow}
                disabled={buyingNow}
                className="w-full bg-[#FFC439] hover:bg-[#F0B429] text-[#1C3163] py-4 rounded-lg mb-6 transition-colors text-[16px] font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buyingNow ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1C3163]"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <span>Buy Now with</span>
                    <span className="font-bold">Stripe</span>
                  </>
                )}
              </button>

              {/* Secure Payment Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-8">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure payment powered by Stripe</span>
              </div>

              {/* About Product */}
              {product.description && (
                <div>
                  <h3 className="text-[#1C3163] text-[18px] sm:text-[20px] font-medium mb-3">
                    About Product
                  </h3>
                  <p className="text-[#1C3163] text-[14px] sm:text-[15px] leading-relaxed mb-4">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Section */}
          <div>
            <h2 className="text-black text-[28px] sm:text-[32px] lg:text-[40px] font-normal mb-8 lg:mb-12">
              Related Products
            </h2>

            {relatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((item) => {
                  const itemImageUrl = item.imageUrl && item.imageUrl.length > 0 
                    ? normalizeImageUrl(item.imageUrl[0])
                    : null;
                  const itemPriceInRupees = item.price.toFixed(2);
                  
                  return (
                    <div key={item._id} className="group">
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white mb-4">
                        {itemImageUrl ? (
                          <ImageMagnifier src={itemImageUrl} alt={item.name} />
                        ) : (
                          <Link href={`/shop/${item._id}`} className="block w-full h-full">
                            <Image
                              src={Bucket1}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </Link>
                        )}
                      </div>
                      <Link
                        href={`/shop/${item._id}`}
                        className="block cursor-pointer"
                      >
                        <div>
                          <p className="text-[#1C3163] text-[14px] sm:text-[16px] font-medium mb-2">
                            {item.name}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-[#1C3163] text-[12px] sm:text-[14px]">
                              ${itemPriceInRupees}
                            </p>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              className="w-8 h-8 rounded-full border-2 border-[#1C3163] flex items-center justify-center hover:bg-[#1C3163] hover:text-white transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[#1C3163] text-center py-8">No related products available</p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;

