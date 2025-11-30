"use client";
import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import { Plus } from "lucide-react";
import {
  Bucket1,
  Bucket2,
  Bucket3,
  FliterIcon,
  SortIcon
} from "@/public/assets";
import Link from "next/link";
const page = () => {
  const Data = [
    {
      id: 1,
      image: Bucket1,
      title: "Quartz Crystal Bowl",
      description: "Premium healing bowl",
      price: "₹1000"
    },
    {
      id: 2,
      image: Bucket2,
      title: "Rose Quartz Bowl",
      description: "Love & harmony bowl",
      price: "₹2000"
    },
    {
      id: 3,
      image: Bucket3,
      title: "Amethyst Crystal Bowl",
      description: "Spiritual healing bowl",
      price: "₹3000"
    },
    {
      id: 4,
      image: Bucket1,
      title: "Clear Quartz Bowl",
      description: "Energy cleansing bowl",
      price: "₹1500"
    },
    {
      id: 5,
      image: Bucket2,
      title: "Citrine Crystal Bowl",
      description: "Abundance & joy bowl",
      price: "₹2500"
    },
    {
      id: 6,
      image: Bucket3,
      title: "Selenite Crystal Bowl",
      description: "Purification bowl",
      price: "₹3500"
    },
    {
      id: 7,
      image: Bucket1,
      title: "Obsidian Crystal Bowl",
      description: "Protection & grounding",
      price: "₹1800"
    },
    {
      id: 8,
      image: Bucket2,
      title: "Jade Crystal Bowl",
      description: "Wisdom & balance bowl",
      price: "₹2800"
    },
    {
      id: 9,
      image: Bucket3,
      title: "Lapis Lazuli Bowl",
      description: "Truth & intuition bowl",
      price: "₹4000"
    },
    {
      id: 10,
      image: Bucket1,
      title: "Tiger's Eye Bowl",
      description: "Courage & strength bowl",
      price: "₹2200"
    },
    {
      id: 11,
      image: Bucket2,
      title: "Moonstone Crystal Bowl",
      description: "Emotional healing bowl",
      price: "₹3200"
    },
    {
      id: 12,
      image: Bucket3,
      title: "Black Tourmaline Bowl",
      description: "Energy protection bowl",
      price: "₹4500"
    }
  ];

  return (
    <div>
      <Navbar />

      <>
        <section className="w-full py-[40px] md:py-[68px] ">
          <div className="max-w-6xl items-center flex flex-col mx-auto px-4">
            {/* Header */}
            <div className="mb-8 items-center   w-full md:mb-12 flex flex-col justify-between sm:flex-row gap-4 sm:gap-8 md:gap-[62px]">
              <div className="flex  items-center gap-[50px]">
                <h2 className="text-black text-[28px] sm:text-[32px] md:text-[40px] font-normal">
                  Services
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-[18px] w-full">
                {Data.map((item) => (
                  <Link 
                    href={`/shop/${item.id}`} 
                    key={item.id} 
                    className="text-black group cursor-pointer"
                  >
                    <div className="relative w-full aspect-square">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="items-end justify-between  flex ">
                      <div className="w-full">
                        <p className="pt-4 sm:pt-6 md:pt-[28px] text-[14px] sm:text-[16px] md:text-[18px]">
                          {item.title}
                        </p>
                        <p className="text-[12px]   w-full flex items-center justify-between sm:text-[13px] md:text-[14px]">
                          {item.description}{" "}
                          <span>
                            <div className="border rounded-full">
                              <Plus />
                            </div>
                          </span>
                        </p>
                        <p className="pt-3 sm:pt-4 md:pt-[18px] text-[10px] sm:text-[11px] md:text-[12px]">
                          {item.price}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </>

      <Footer />
    </div>
  );
};

export default page;
