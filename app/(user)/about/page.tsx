"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import { About1, About2, About3, HeroImage } from "@/public/assets";
import { AboutSkeleton, ImageWithShimmer } from "./components";

const AboutPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const Data = [
    {
      id: 1,
      image: About1
    },
    {
      id: 2,
      image: About2
    },
    {
      id: 3,
      image: About3
    }
  ];

  // Show skeleton while loading
  if (isLoading) {
    return (
      <>
        <Navbar />
        <AboutSkeleton />
        <Footer />
      </>
    );
  }

  return (
    <div className=' bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen'>
      <div>
        <Navbar />
      </div>
      <div className="max-w-7xl border-b border-[#D5B584] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid pt-[30px] sm:pt-[40px] md:pt-[54px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Data.map((item) => (
            <div key={item.id} className="relative group overflow-hidden">
              <ImageWithShimmer
                src={item.image}
                alt={`About ${item.id}`}
                width={500}
                height={500}
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none"></div>
            </div>
          ))}
        </div>

        <div className="w-full py-[40px]  ">
          <div className="md:w-[70%] w-full  "> 
            <h1 className="">
              <span className="text-[#D5B584] italic text-[18px] sm:text-[22px] md:text-[30px] ">
                Crystal Bowl Studio
              </span>{" "}
              <span className="text-[#1C3163] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px]">
                is created and designed by master sound and energy healer
                Francesca Wong, fulfilling her dream to create a range of
                crystal bowls that are beautifully designed, with premium
                crystal quality and sound, with a powerful resonance and energy.
                at a more affordable price to make sound healing more accessible
                to healers all over the world.
              </span>
            </h1>
            <div className="flex flex-col text-[14px] sm:text-[15px] md:text-[16px] font-[300] gap-[20px] sm:gap-[25px] md:gap-[30px]">
              <p>
                Our Crystal Bowls are 100% clear quartz crystal, with some of
                our premium designs infused with other crystals, metals and
                earth elements. They are lightweight and come in the most
                magical designs and colors to really make your practice unique.
                Take them with you on your Travels!
              </p>
              <p>
                Each bowl carries its own unique energy and intention so you can
                choose yours to match your own unique intentions, energy and
                aesthetic as a healer.
              </p>

              <h2 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[30px] text-[#D5B584] font-[500]">
                Yogi & music healer inspired by ancient traditions & modern
                well-being. 
              </h2>

              <div>
                <h1 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[30px] text-[#1C3163] font-[500]">
                  Find Balance. Heal Through Yoga & Sound. Awaken Your True
                  Self.
                </h1>
                <p className="font-[300] text-[14px] sm:text-[15px] md:text-[16px]">
                  Discover the power of sound healing, yoga, and meditation to
                  restore harmony within. Whether you&apos;re seeking relaxation,
                  stress relief, emotional release, or deep transformation,
                  Frankie guides you through immersive experiences that
                  reconnect you to your essence.
                </p>
              </div>
              <p className="text-[14px] sm:text-[15px] md:text-[16px] font-[300] text-[#1C3163]"> Based in Singapore | Available for global retreats & corporate wellness</p>
            </div>
          </div>
        </div>
      </div>
<div></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[60px] sm:py-[80px] md:py-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-[#D5B584] text-[32px] sm:text-[40px]  font-normal font-serif">
              Meet Frankie
            </h2>
            
            <div className="space-y-4 text-[#1C3163]">
              <p className="text-[15px] sm:text-[16px] md:text-[26px] leading-relaxed">
                <span className="font-medium">Frankie</span> is a certified yoga teacher (e-RYT500), 
                sound healer, and transformational guide. With over 15 years of experience and deep 
                training in India and Australia, she blends ancient philosophy with modern well-being 
                practices.
              </p>
              
              <p className="text-[14px] sm:text-[15px] md:text-[16px] font-[300] leading-relaxed italic text-[#1C3163]/80">
                Her mission? To help individuals and teams manage stress, activate inner healing, and find 
                balance through yoga, sound baths, and energy work.
              </p>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative w-full flex justify-center lg:justify-end py-8 sm:py-12 md:py-16">
            <div className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-[300px] group">
              {/* Decorative Cards - Plus Icon Pattern */}
              {/* Vertical Card - Same dimensions as image, slightly offset */}
              {/* <div className="absolute top-1/2 left-1/2 w-full aspect-[3/4] bg-[#1C3163] rounded-[15px] sm:rounded-[18px] md:rounded-[20px] -translate-x-[45%] -translate-y-1/2 rotate-[8deg] shadow-lg"></div> */}
              
              {/* Horizontal Card - Rotated 90 degrees */}
              <div className="absolute top-1/2 left-1/2 w-full aspect-[3/4] bg-[#1C3163] rounded-[15px] sm:rounded-[18px] md:rounded-[20px] -translate-x-[50%] -translate-y-1/2 rotate-90 group-hover:rotate-60 transition-transform duration-300 ease-out shadow-lg"></div>
              
              {/* Main Image */}
              <div className="relative w-full aspect-[3/4] rounded-[15px] sm:rounded-[18px] md:rounded-[20px] overflow-hidden  z-10">
                <ImageWithShimmer
                  src={HeroImage}
                  alt="Frankie in meditation pose"
                  fill
                  className="object-cover group-hover:rotate-3 transition-transform duration-300 ease-out"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
