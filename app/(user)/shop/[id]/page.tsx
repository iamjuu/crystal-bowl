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
  shortDescription?: string;
  imageUrl?: string[];
  videoUrl?: string | string[];
  relativeproduct?: boolean;
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
  const [relativeProduct, setRelativeProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyingNow, setBuyingNow] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
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

  const fetchRelativeProduct = async () => {
    try {
      // Fetch products including relative products
      const response = await fetch("/api/products?includeRelative=true&limit=100");
      const data = await response.json();
      if (data.success && data.data) {
        // Look for a relative product that's not the current one
        const relative = data.data.find((p: Product) => p.relativeproduct === true && p._id !== productId);
        if (relative) {
          setRelativeProduct(relative);
        }
      }
    } catch (error) {
      console.error("Failed to fetch relative product:", error);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchRelatedProducts();
      // Only fetch relative product if current product is not a relative product
      fetchRelativeProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    // Only show relative product if current product is NOT a relative product
    if (product && product.relativeproduct) {
      setRelativeProduct(null);
    }
  }, [product]);

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
  
  // Format price to show decimals only if needed
  const formatPrice = (price: number) => {
    const rounded = Math.round(price * 100) / 100;
    if (rounded % 1 === 0) {
      return `$${rounded}`;
    }
    return `$${rounded.toFixed(2)}`;
  };
  const priceInDollars = formatPrice(product.price);

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
  };

  // Handle Add Relative Product to Cart
  const handleAddRelativeProductToCart = () => {
    if (!relativeProduct) return;
    
    // Check if user is logged in
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    // Get first image URL for cart
    const imageUrl = relativeProduct.imageUrl && relativeProduct.imageUrl.length > 0
      ? normalizeImageUrl(relativeProduct.imageUrl[0])
      : "";

    addItem({
      id: relativeProduct._id,
      name: relativeProduct.name,
      price: relativeProduct.price, // Price in dollars
      imageUrl: imageUrl,
    });

    toast.success("Added to cart!");
  };

  // Handle Instant Buy - redirect to order confirmation
  const handleBuyNow = async () => {
    // Check if user is logged in
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login to proceed with purchase");
      router.push("/login");
      return;
    }

    // Redirect to order confirmation with instant buy params
    router.push(`/order-confirmation?type=instant&productId=${product._id}&quantity=1`);
  };

  return (
    <div className=" bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen]">
      <Navbar />

      <section className="w-full py-[40px] md:py-[68px]">
        <div className="max-w-6xl mx-auto px-4">
          {/* Product Detail Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 lg:mb-24 lg:items-start">
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
                  <ImageMagnifier src={mainImage} alt={product.name} />
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

              <div className="mb-4">
                <p className="text-[#1C3163] text-[24px] sm:text-[28px] lg:text-[32px] font-medium">
                  {priceInDollars}
                </p>
              </div>

              {/* Short Description - Show after price */}
              {product.shortDescription && (
                <div className="mb-6">
                  <p className="text-[#1C3163] text-[14px] sm:text-[15px] leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>
              )}

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

              {/* Relative Product - Show after cart button if current product is NOT a relative product */}
              {relativeProduct && !product.relativeproduct && (
                <>
                {/* <h1 className="text-[#1C3163] text-[14px] sm:text-[18px] lg:text-[20px] font-medium mb-4">
                Learn how to play the crystal bowls
                </h1> */}
              
                  <h1 className="text-[#1C3163] text-[14px] sm:text-[18px] lg:text-[20px] font-medium mb-4">
                    Learn how to play the crystal bowls
                  </h1>
                  <Link href={`/shop/${relativeProduct._id}`}>
                <div className="mb-8 border border-[#D5B584]/30 rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-4">
                    {relativeProduct.imageUrl && relativeProduct.imageUrl.length > 0 && (
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={normalizeImageUrl(relativeProduct.imageUrl[0])}
                          alt={relativeProduct.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-[#D5B584] text-[16px] font-medium mb-1">
                        {relativeProduct.name}
                      </h4>
                      <p className="text-[#D5B584] text-[14px]">
                        {formatPrice(relativeProduct.price)}
                      </p>
                    </div>
                    <button
                      onClick={handleAddRelativeProductToCart}
                      className="bg-[#D5B584] hover:bg-[#C4A573] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                </div>


                </Link>
                </>
              )}

              {/* Description Section - Accordion Style */}
              {product.description && (
                <div className="mb-6 border-t border-b border-[#D5B584]/30">
                  <button
                    onClick={() => toggleSection("description")}
                    className="w-full py-4 flex items-center justify-between text-left"
                  >
                    <h3 className="text-[#1C3163] text-[18px] sm:text-[20px] font-medium">
                      Description
                    </h3>
                    <span className="text-[#1C3163] text-2xl">
                      {expandedSections.has("description") ? "−" : "+"}
                    </span>
                  </button>
                  {expandedSections.has("description") && (
                    <div className="pb-4">
                      <p className="text-[#1C3163] text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap">
                        {product.description}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Information Sections - Accordion Style */}
              <div className="mb-6 space-y-0">
                {/* Bowl Sizing */}
                <div className="border-t border-[#D5B584]/30">
                  <button
                    onClick={() => toggleSection("bowlSizing")}
                    className="w-full py-4 flex items-center justify-between text-left"
                  >
                    <h3 className="text-[#1C3163] text-[18px] sm:text-[20px] font-medium">
                      Bowl Sizing
                    </h3>
                    <span className="text-[#1C3163] text-2xl">
                      {expandedSections.has("bowlSizing") ? "−" : "+"}
                    </span>
                  </button>
                  {expandedSections.has("bowlSizing") && (
                    <div className="pb-4">
                      <p className="text-[#1C3163] text-[14px] sm:text-[15px] leading-relaxed">
                        Our crystal bowls come in various sizes to suit different healing practices. We offer bowls ranging from small (4-6 inches) for personal use to large (12-14 inches) for group sessions. Each size is carefully crafted to produce specific frequencies and resonances. The size you choose depends on your intended use - smaller bowls are perfect for individual meditation and chakra work, while larger bowls create powerful sound waves ideal for group healing sessions.
                      </p>
                    </div>
                  )}
                </div>

                {/* Shipping and Delivery */}
                <div className="border-t border-[#D5B584]/30">
                  <button
                    onClick={() => toggleSection("shipping")}
                    className="w-full py-4 flex items-center justify-between text-left"
                  >
                    <h3 className="text-[#1C3163] text-[18px] sm:text-[20px] font-medium">
                      Shipping and Delivery
                    </h3>
                    <span className="text-[#1C3163] text-2xl">
                      {expandedSections.has("shipping") ? "−" : "+"}
                    </span>
                  </button>
                  {expandedSections.has("shipping") && (
                    <div className="pb-4">
                      <p className="text-[#1C3163] text-[14px] sm:text-[15px] leading-relaxed mb-3">
                        We offer Air Express shipping to ensure your crystal bowls arrive safely and promptly. Shipping charges are calculated based on the total number of bowls in your order:
                      </p>
                      <ul className="list-disc list-inside text-[#1C3163] text-[14px] sm:text-[15px] space-y-2 ml-2">
                        <li>1 Bowl: SGD $65</li>
                        <li>2-3 Bowls: SGD $111</li>
                        <li>4-7 Bowls: SGD $155</li>
                        <li>8+ Bowls: Rates continue in cycles (8 = $65, 9-10 = $111, 11-14 = $155, and so on)</li>
                      </ul>
                      <p className="text-[#1C3163] text-[14px] sm:text-[15px] leading-relaxed mt-3">
                        All orders are carefully packaged to protect your bowls during transit. Delivery times vary by location, typically 7-14 business days for international orders.
                      </p>
                      
                      {/* Additional Information */}
                      <div className="mt-6 space-y-4 pt-4 border-t border-[#D5B584]/30">
                        <div>
                          <h4 className="text-[#1C3163] font-semibold text-[14px] sm:text-[15px] mb-1">Return Policy</h4>
                          <p className="text-[#2C3E50] text-[13px] sm:text-[14px]">No Returns unless it&apos;s broken</p>
                        </div>
                        <div>
                          <h4 className="text-[#1C3163] font-semibold text-[14px] sm:text-[15px] mb-1">Care Instructions</h4>
                          <p className="text-[#2C3E50] text-[13px] sm:text-[14px]">Wipe with soft cloth, avoid water contact</p>
                        </div>
                        <div>
                          <h4 className="text-[#1C3163] font-semibold text-[14px] sm:text-[15px] mb-1">Includes Accessories</h4>
                          <p className="text-[#2C3E50] text-[13px] sm:text-[14px]">Rubber ring + suede mallet</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3rd vs 4th Octave */}
                <div className="border-t border-[#D5B584]/30">
                  <button
                    onClick={() => toggleSection("octave")}
                    className="w-full py-4 flex items-center justify-between text-left"
                  >
                    <h3 className="text-[#1C3163] text-[18px] sm:text-[20px] font-medium">
                      What's the difference between 3rd and 4th Octave bowls?
                    </h3>
                    <span className="text-[#1C3163] text-2xl">
                      {expandedSections.has("octave") ? "−" : "+"}
                    </span>
                  </button>
                  {expandedSections.has("octave") && (
                    <div className="pb-4">
                      <p className="text-[#1C3163] text-[14px] sm:text-[15px] leading-relaxed">
                        The 3rd octave bowls produce deeper, more grounding frequencies that are ideal for root chakra work and deep meditation. These bowls create a rich, resonant sound that helps anchor you to the earth and promotes feelings of stability and security. The 4th octave bowls have higher, more ethereal frequencies that are perfect for crown chakra activation and spiritual connection. These bowls produce lighter, more uplifting tones that can help elevate consciousness and facilitate connection with higher realms. Each octave offers unique healing properties, and many practitioners use both in their healing sessions for a complete chakra balancing experience.
                      </p>
                    </div>
                  )}
                </div>

                {/* Tuning System */}
                <div className="border-t border-[#D5B584]/30">
                  <button
                    onClick={() => toggleSection("tuning")}
                    className="w-full py-4 flex items-center justify-between text-left"
                  >
                    <h3 className="text-[#1C3163] text-[18px] sm:text-[20px] font-medium">
                      Which tuning system are Our Bowls made in?
                    </h3>
                    <span className="text-[#1C3163] text-2xl">
                      {expandedSections.has("tuning") ? "−" : "+"}
                    </span>
                  </button>
                  {expandedSections.has("tuning") && (
                    <div className="pb-4">
                      <p className="text-[#1C3163] text-[14px] sm:text-[15px] leading-relaxed mb-3">
                        Our bowls are available in multiple tuning frequencies to suit your preferences:
                      </p>
                      <ul className="list-disc list-inside text-[#1C3163] text-[14px] sm:text-[15px] space-y-2 ml-2">
                        <li><strong>432 Hz:</strong> The healing frequency of nature, known for its calming and harmonizing effects. This is our standard tuning and is believed to resonate with the natural frequency of the universe.</li>
                        <li><strong>440 Hz:</strong> Western standard tuning, commonly used in modern music. This frequency is familiar to most ears and works well for general sound healing.</li>
                        <li><strong>528 Hz:</strong> The miracle frequency of unconditional love, known for its transformative and healing properties. This frequency is said to repair DNA and promote positive transformation.</li>
                      </ul>
                      <p className="text-[#1C3163] text-[14px] sm:text-[15px] leading-relaxed mt-3">
                        If you would like your bowls in an alternative frequency, please leave a note on your order at checkout and we can customize your order to your preferred frequency.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Information */}
              {/* <div className=" border border-[#D5B584]/40 rounded-lg p-4 sm:p-6 space-y-3">
                <div>
                  <h4 className="text-[#1C3163] font-semibold text-[14px] sm:text-[15px] mb-1">Return Policy</h4>
                  <p className="text-[#2C3E50] text-[13px] sm:text-[14px]">No Returns unless it's broken</p>
                </div>
                <div>
                  <h4 className="text-[#1C3163] font-semibold text-[14px] sm:text-[15px] mb-1">Care Instructions</h4>
                  <p className="text-[#2C3E50] text-[13px] sm:text-[14px]">Wipe with soft cloth, avoid water contact</p>
                </div>
                <div>
                  <h4 className="text-[#1C3163] font-semibold text-[14px] sm:text-[15px] mb-1">Includes Accessories</h4>
                  <p className="text-[#2C3E50] text-[13px] sm:text-[14px]">Rubber ring + suede mallet</p>
                </div>
              </div> */}
            </div>
          </div>

          {/* Related Products Section - Only show if current product is NOT a relative product */}
          {!product.relativeproduct && (
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
                  const itemPriceInDollars = formatPrice(item.price);
                  
                  return (
                    <div key={item._id} className="group">
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white mb-4">
                        {itemImageUrl ? (
                          <Link href={`/shop/${item._id}`} className="block w-full h-full">
                            <Image
                              src={itemImageUrl}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              unoptimized
                            />
                          </Link>
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
                              {itemPriceInDollars}
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
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;

