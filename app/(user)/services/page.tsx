'use client'

import React from 'react'
import Image from 'next/image'
import { About1, About2,About3, Services1, Services2, Services3, Services4 } from '@/public/assets'
import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'

const ServicesPage = () => {
  const corporateGroupData = [
    {
      id: 1,
      image: About1,
      title: "Journey To Yourself: Chakra Sound Bath Workshop"
    },
    {
      id: 2,
      image: About2,
      title: "Gong Yin & Meditation"
    },
    {
      id: 3,
      image: About3,
      title: "Power Nap Sound Bath"
    },
    {
      id: 4,
      image: About2,
      title: "Corporate Wellness Program"
    }
  ];

  return (
    <>
    <Navbar/>
    <div className="w-full bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
      <section className="w-full px-4 md:px-0 py-[68px]">
        <div className="max-w-6xl pb-[106px] border-b mx-auto">
          <div className="flex flex-col w-full">
            {/* Section Title */}
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] pb-4 sm:pb-5 md:pb-6 text-[#D5B584] font-normal">
              Services
            </h2>

            {/* Content Container */}
            <div className="flex flex-col lg:flex-row w-full   items-center gap-8 md:gap-10 lg:gap-12">
              {/* Left side - Text Content */}
              <div className="w-full lg:w-[65%]  xl:w-[70%]">
                <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[16px] font-light text-[#6B5D4F] leading-relaxed sm:leading-relaxed md:leading-loose">
                  <p>
                    Sound healing is a transformative practice that uses vibrational frequencies to restore balance and promote deep healing in the body, mind, and spirit. Through the resonant tones of Crystal Singing Bowls, Gongs, Ting Shas and Harmonium, sound healing works by creating specific frequencies that interact with the body's energetic field, helping to release blockages, calm the nervous system, and restore harmony.
                  </p>

                  <p>
                    Scientifically, sound healing is grounded in the concept of vibrational medicine, where sound waves are recognized for their ability to influence physical and mental states. Research has shown that different frequencies can stimulate the body's cells and nervous system, inducing relaxation and promoting healing. For example, sound frequencies can reduce stress hormones, lower blood pressure, and activate theta waves, increase brainwave activity associated with deep relaxation and meditative states, such as alpha and theta waves. Studies have also suggested that sound healing may help improve sleep, enhance cognitive function, and promote overall well-being.
                  </p>

                  <p>
                    Whether through a guided sound bath, meditation or private session, sound healing offers a powerful way to reconnect with your inner self, reduce stress, and achieve mental, emotional and physical balance. It's a holistic therapy that
                  </p>
                </div>
              </div>

              {/* Right side - Abstract Graphics */}
              <div className="w-full h-full  lg:w-[35%] xl:w-[30%] grid grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 mt-4 lg:mt-0">
                {/* First Column */}
                <div className="flex flex-col gap-4 sm:gap-6 lg:gap-4">
                  <div className="w-full">
                    <Image
                      src={Services1}
                      alt="decorative icon"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <div className="w-full">
                    <Image
                      src={Services2}
                      alt="decorative icon"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>

                {/* Second Column */}
                <div className="flex flex-col gap-4 sm:gap-6 lg:gap-4">
                  <div className="w-full">
                    <Image
                      src={Services3}
                      alt="decorative icon"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <div className="w-full">
                    <Image
                      src={Services4}
                      alt="decorative icon"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Work With Me Section */}
        <div className='max-w-6xl mx-auto mt-16 md:mt-20 lg:mt-24 px-4 md:px-0'>
          <div className="flex flex-col lg:flex-row w-full gap-8 md:gap-12 lg:gap-16">
            {/* Left side - Title */}
            <div className="w-full lg:w-[40%]">
              <h2 className="text-[32px] sm:text-[36px] md:text-[40px]  text-[#D5B584] font-light leading-tight">
                Work With Me
              </h2>
            </div>

            {/* Right side - Content */}
            <div className="w-full lg:w-[60%]">
              <div className="flex flex-col gap-6">
                <h3 className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] text-[#2C3E50] font-normal">
                  Healing Through Sound, Movement & Energy Work
                </h3>
                <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#6B5D4F] font-light leading-relaxed">
                  I offer tailored experiences for individuals, groups, and organizations seeking deep transformation through sound healing, yoga, and meditation.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='max-w-6xl mx-auto mt-16 md:mt-20 lg:mt-24 px-4 md:px-0'>
          <h2 className="text-[32px] pb-[70px]  sm:text-[36px] md:text-[40px]  text-[#D5B584] font-light leading-tight">
            For Corporate & Group
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {corporateGroupData.map((item) => (
              <div key={item.id} className="relative group overflow-hidden rounded-[20px]">
                <Image
                  src={item.image}
                  alt={`Corporate & Group ${item.id}`}
                  width={500}
                  height={500}
                  className="w-full h-auto object-cover"
                />
                {/* Overlay with Title and Button */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 sm:p-5 md:p-6">
                  <h3 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-normal mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <button className="flex items-center gap-2 text-white text-[14px] sm:text-[15px] font-light hover:gap-3 transition-all duration-300">
                    Book Now
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='max-w-6xl mx-auto mt-16 md:mt-20 lg:mt-24 px-4 md:px-0'>
          <h2 className="text-[32px] pb-[70px]  sm:text-[36px] md:text-[40px]  text-[#D5B584] font-light leading-tight">
            For Corporate & Group
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {corporateGroupData.map((item) => (
              <div key={item.id} className="relative group overflow-hidden rounded-[20px]">
                <Image
                  src={item.image}
                  alt={`Corporate & Group ${item.id}`}
                  width={500}
                  height={500}
                  className="w-full h-auto object-cover"
                />
                {/* Overlay with Title and Button */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 sm:p-5 md:p-6">
                  <h3 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-normal mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <button className="flex items-center gap-2 text-white text-[14px] sm:text-[15px] font-light hover:gap-3 transition-all duration-300">
                    Book Now
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    <Footer/>
    </>
  )
}

export default ServicesPage

