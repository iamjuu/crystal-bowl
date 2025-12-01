"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import { About1, About2, About3, HeroImage } from "@/public/assets";
const page = () => {
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
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="max-w-7xl border-b border-[#D5B584] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid pt-[30px] sm:pt-[40px] md:pt-[54px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Data.map((item) => (
            <div key={item.id}>
              <Image
                src={item.image}
                alt={`About ${item.id}`}
                width={500}
                height={500}
              />
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
            <h2 className="text-[#D5B584] text-[32px] sm:text-[40px] md:text-[48px] font-normal font-serif">
              Meet Frankie
            </h2>
            
            <div className="space-y-4 text-[#1C3163]">
              <p className="text-[15px] sm:text-[16px] md:text-[26px] leading-relaxed">
                <span className="font-medium">Frankie</span> is a certified yoga teacher (e-RYT500), 
                sound healer, and transformational guide. With over 15 years of experience and deep 
                training in India and Australia, she blends ancient philosophy with modern well-being 
                practices.
              </p>
              
              <p className="text-[14px] sm:text-[15px] md:text-[16px] font-[200] leading-relaxed italic text-[#1C3163]/80">
                Her mission? To help individuals and teams manage stress, activate inner healing, and find 
                balance through yoga, sound baths, and energy work.
              </p>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative w-full flex justify-center lg:justify-end py-8 sm:py-12 md:py-16">
            <div className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-[300px]">
              {/* Decorative Cards - Plus Icon Pattern */}
              {/* Vertical Card */}
              {/* <div className="absolute top-1/2 left-1/2 w-[280px] h-[480px] bg-[#1C3163] rounded-[30px] -z-10 -translate-x-1/2 -translate-y-1/2 rotate-0"></div> */}
              
              {/* Horizontal Card */}
              <div className="absolute top-1/2 left-1/2 w-[220px] h-[380px] sm:w-[260px] sm:h-[440px] md:w-[280px] md:h-[480px] bg-[#1C3163] rounded-[20px] sm:rounded-[25px] md:rounded-[30px] -z-20 -translate-x-1/2 -translate-y-1/2 rotate-90"></div>
              
              {/* Main Image */}
              <div className="relative w-full aspect-[3/4] rounded-[15px] sm:rounded-[18px] md:rounded-[20px] overflow-hidden shadow-2xl z-10">
                <Image
                  src={HeroImage}
                  alt="Frankie in meditation pose"
                  fill
                  className="object-cover"
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

export default page;
