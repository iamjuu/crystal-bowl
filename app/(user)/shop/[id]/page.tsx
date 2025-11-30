"use client";
import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Bucket1, Bucket2, Bucket3 } from "@/public/assets";
import { useParams } from "next/navigation";
import Link from "next/link";

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params.id;
  const [selectedImage, setSelectedImage] = useState(0);

  // Sample product data - in a real app, this would come from an API or database
  const allProducts = [
    {
      id: 1,
      image: Bucket1,
      title: "Pro Sage Aura Blue Crystal Singing Bowl",
      description: "Premium healing bowl",
      price: "₹1000",
      fullDescription:
        "Lorem ipsum dolor sit amet, consectetur. Pretium eget imperdiet volutpat odio. Ut cursus diam. Eget aliquam et ut morbi. Nunc, at sit lacus, diam. Nunc, at sit lacus, diam. Mus ut id tincidunt turpis.",
      images: [Bucket1, Bucket2, Bucket3, Bucket1]
    },
    {
      id: 2,
      image: Bucket2,
      title: "Rose Quartz Bowl",
      description: "Love & harmony bowl",
      price: "₹2000",
      fullDescription:
        "Lorem ipsum dolor sit amet, consectetur. Pretium eget imperdiet volutpat odio. Ut cursus diam. Eget aliquam et ut morbi. Nunc, at sit lacus, diam. Nunc, at sit lacus, diam. Mus ut id tincidunt turpis.",
      images: [Bucket2, Bucket1, Bucket3, Bucket2]
    },
    {
      id: 3,
      image: Bucket3,
      title: "Amethyst Crystal Bowl",
      description: "Spiritual healing bowl",
      price: "₹3000",
      fullDescription:
        "Lorem ipsum dolor sit amet, consectetur. Pretium eget imperdiet volutpat odio. Ut cursus diam. Eget aliquam et ut morbi. Nunc, at sit lacus, diam. Nunc, at sit lacus, diam. Mus ut id tincidunt turpis.",
      images: [Bucket3, Bucket1, Bucket2, Bucket3]
    },
    {
      id: 4,
      image: Bucket1,
      title: "Clear Quartz Bowl",
      description: "Energy cleansing bowl",
      price: "₹1500",
      fullDescription:
        "Lorem ipsum dolor sit amet, consectetur. Pretium eget imperdiet volutpat odio. Ut cursus diam. Eget aliquam et ut morbi. Nunc, at sit lacus, diam. Nunc, at sit lacus, diam. Mus ut id tincidunt turpis.",
      images: [Bucket1, Bucket2, Bucket3, Bucket1]
    },
    {
      id: 5,
      image: Bucket2,
      title: "Citrine Crystal Bowl",
      description: "Abundance & joy bowl",
      price: "₹2500",
      fullDescription:
        "Lorem ipsum dolor sit amet, consectetur. Pretium eget imperdiet volutpat odio. Ut cursus diam. Eget aliquam et ut morbi. Nunc, at sit lacus, diam. Nunc, at sit lacus, diam. Mus ut id tincidunt turpis.",
      images: [Bucket2, Bucket1, Bucket3, Bucket2]
    },
    {
      id: 6,
      image: Bucket3,
      title: "Selenite Crystal Bowl",
      description: "Purification bowl",
      price: "₹3500",
      fullDescription:
        "Lorem ipsum dolor sit amet, consectetur. Pretium eget imperdiet volutpat odio. Ut cursus diam. Eget aliquam et ut morbi. Nunc, at sit lacus, diam. Nunc, at sit lacus, diam. Mus ut id tincidunt turpis.",
      images: [Bucket3, Bucket1, Bucket2, Bucket3]
    },
    {
      id: 7,
      image: Bucket1,
      title: "Obsidian Crystal Bowl",
      description: "Protection & grounding",
      price: "₹1800",
      fullDescription:
        "Lorem ipsum dolor sit amet, consectetur. Pretium eget imperdiet volutpat odio. Ut cursus diam. Eget aliquam et ut morbi. Nunc, at sit lacus, diam. Nunc, at sit lacus, diam. Mus ut id tincidunt turpis.",
      images: [Bucket1, Bucket2, Bucket3, Bucket1]
    },
    {
      id: 8,
      image: Bucket2,
      title: "Jade Crystal Bowl",
      description: "Wisdom & balance bowl",
      price: "₹2800",
      fullDescription:
        "Lorem ipsum dolor sit amet, consectetur. Pretium eget imperdiet volutpat odio. Ut cursus diam. Eget aliquam et ut morbi. Nunc, at sit lacus, diam. Nunc, at sit lacus, diam. Mus ut id tincidunt turpis.",
      images: [Bucket2, Bucket1, Bucket3, Bucket2]
    },
    {
      id: 9,
      image: Bucket3,
      title: "Lapis Lazuli Bowl",
      description: "Truth & intuition bowl",
      price: "₹4000",
      fullDescription:
        "Lorem ipsum dolor sit amet, consectetur. Pretium eget imperdiet volutpat odio. Ut cursus diam. Eget aliquam et ut morbi. Nunc, at sit lacus, diam. Nunc, at sit lacus, diam. Mus ut id tincidunt turpis.",
      images: [Bucket3, Bucket1, Bucket2, Bucket3]
    },
    {
      id: 10,
      image: Bucket1,
      title: "Tiger's Eye Bowl",
      description: "Courage & strength bowl",
      price: "₹2200",
      fullDescription:
        "Lorem ipsum dolor sit amet, consectetur. Pretium eget imperdiet volutpat odio. Ut cursus diam. Eget aliquam et ut morbi. Nunc, at sit lacus, diam. Nunc, at sit lacus, diam. Mus ut id tincidunt turpis.",
      images: [Bucket1, Bucket2, Bucket3, Bucket1]
    },
    {
      id: 11,
      image: Bucket2,
      title: "Moonstone Crystal Bowl",
      description: "Emotional healing bowl",
      price: "₹3200",
      fullDescription:
        "Lorem ipsum dolor sit amet, consectetur. Pretium eget imperdiet volutpat odio. Ut cursus diam. Eget aliquam et ut morbi. Nunc, at sit lacus, diam. Nunc, at sit lacus, diam. Mus ut id tincidunt turpis.",
      images: [Bucket2, Bucket1, Bucket3, Bucket2]
    },
    {
      id: 12,
      image: Bucket3,
      title: "Black Tourmaline Bowl",
      description: "Energy protection bowl",
      price: "₹4500",
      fullDescription:
        "Lorem ipsum dolor sit amet, consectetur. Pretium eget imperdiet volutpat odio. Ut cursus diam. Eget aliquam et ut morbi. Nunc, at sit lacus, diam. Nunc, at sit lacus, diam. Mus ut id tincidunt turpis.",
      images: [Bucket3, Bucket1, Bucket2, Bucket3]
    }
  ];

  const product = allProducts.find((p) => p.id === parseInt(productId as string));

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-2xl">Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Get related products (excluding current product)
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-[#F5F5F0]">
      <Navbar />

      <section className="w-full py-[40px] md:py-[68px]">
        <div className="max-w-6xl mx-auto px-4">
          {/* Product Detail Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 lg:mb-24">
            {/* Left Side - Images */}
            <div className="flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnail Images */}
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
                {product.images.map((img, index) => (
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
                      src={img}
                      alt={`Product view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div className="flex flex-col">
              <h1 className="text-[#1C3163] text-[28px] sm:text-[32px] lg:text-[36px] font-normal mb-4 leading-tight">
                8&quot; D-5 Tibetan Quartz Copper Aura, Alchemy Crystal Singing Bowl
              </h1>

              <div className="mb-6">
                <p className="text-[#1C3163] text-[24px] sm:text-[28px] lg:text-[32px] font-medium">
                  {product.price}
                </p>
              </div>

              {/* Add to Cart Button */}
              <button className="w-full bg-[#2C3E50] hover:bg-[#1C3163] text-white py-4 rounded-lg mb-4 transition-colors text-[16px] font-medium">
                Add Cart
              </button>

              {/* Buy with PayPal Button */}
              <button className="w-full bg-[#FFC439] hover:bg-[#F0B429] text-[#1C3163] py-4 rounded-lg mb-6 transition-colors text-[16px] font-medium flex items-center justify-center gap-2">
                <span>Buy with</span>
                <span className="font-bold">Strip</span>
              </button>

              {/* More Payment Options */}
              <button className="text-[#1C3163] text-[14px] underline mb-8 text-left">
                More Payment Options ↓
              </button>

              {/* About Product */}
              <div>
                <h3 className="text-[#1C3163] text-[18px] sm:text-[20px] font-medium mb-3">
                  About Product
                </h3>
                <p className="text-[#1C3163] text-[14px] sm:text-[15px] leading-relaxed mb-4">
                  {product.fullDescription}
                </p>
                <button className="text-[#1C3163] text-[14px] font-medium underline">
                  Read More
                </button>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <div>
            <h2 className="text-black text-[28px] sm:text-[32px] lg:text-[40px] font-normal mb-8 lg:mb-12">
              Related Products
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((item) => (
                <Link
                  href={`/shop/${item.id}`}
                  key={item.id}
                  className="group cursor-pointer"
                >
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white mb-4">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <p className="text-[#1C3163] text-[14px] sm:text-[16px] font-medium mb-2">
                      {item.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-[#1C3163] text-[12px] sm:text-[14px]">
                        {item.price}
                      </p>
                      <button className="w-8 h-8 rounded-full border-2 border-[#1C3163] flex items-center justify-center hover:bg-[#1C3163] hover:text-white transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;

