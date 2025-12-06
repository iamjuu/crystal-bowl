"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Services1,
  Services2,
  Services3,
  Services4
} from "@/public/assets";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";

type Session = {
  _id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  sessionType?: "regular" | "corporate" | "private" | "discovery";
  format?: string;
  benefits?: string[];
  createdAt: string;
  updatedAt: string;
};

const ServicesPage = () => {
  const router = useRouter();
  const [corporateCurrentIndex, setCorporateCurrentIndex] = useState(0);
  const [privateCurrentIndex, setPrivateCurrentIndex] = useState(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // Fetch sessions
  const fetchSessions = async () => {
    try {
      setSessionsLoading(true);
      const response = await fetch("/api/sessions");
      const data = await response.json();
      console.log("Sessions API response:", data); // Debug log
      if (data.success && data.data) {
        console.log("Sessions loaded:", data.data.length); // Debug log
        setSessions(data.data);
      } else {
        console.error("Failed to fetch sessions:", data.message || "Unknown error");
        setSessions([]);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Filter sessions by type
  const corporateSessions = sessions.filter((s) => s.sessionType === "corporate");
  const privateSessions = sessions.filter((s) => s.sessionType === "private");

  const handleCorporatePrev = () => {
    setCorporateCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, corporateSessions.length - 1) : prev - 1
    );
  };

  const handleCorporateNext = () => {
    setCorporateCurrentIndex((prev) =>
      prev === Math.max(0, corporateSessions.length - 1) ? 0 : prev + 1
    );
  };

  const handlePrivatePrev = () => {
    setPrivateCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, privateSessions.length - 1) : prev - 1
    );
  };

  const handlePrivateNext = () => {
    setPrivateCurrentIndex((prev) =>
      prev === Math.max(0, privateSessions.length - 1) ? 0 : prev + 1
    );
  };

  return (
    <div className=" bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
      <Navbar />
      <div className="w-full ">
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
                      Sound healing is a transformative practice that uses
                      vibrational frequencies to restore balance and promote
                      deep healing in the body, mind, and spirit. Through the
                      resonant tones of Crystal Singing Bowls, Gongs, Ting Shas
                      and Harmonium, sound healing works by creating specific
                      frequencies that interact with the body&apos;s energetic field,
                      helping to release blockages, calm the nervous system, and
                      restore harmony.
                    </p>

                    <p>
                      Scientifically, sound healing is grounded in the concept
                      of vibrational medicine, where sound waves are recognized
                      for their ability to influence physical and mental states.
                      Research has shown that different frequencies can
                      stimulate the body&apos;s cells and nervous system, inducing
                      relaxation and promoting healing. For example, sound
                      frequencies can reduce stress hormones, lower blood
                      pressure, and activate theta waves, increase brainwave
                      activity associated with deep relaxation and meditative
                      states, such as alpha and theta waves. Studies have also
                      suggested that sound healing may help improve sleep,
                      enhance cognitive function, and promote overall
                      well-being.
                    </p>

                    <p>
                      Whether through a guided sound bath, meditation or private
                      session, sound healing offers a powerful way to reconnect
                      with your inner self, reduce stress, and achieve mental,
                      emotional and physical balance. It&apos;s a holistic therapy
                      that
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
          <div className="max-w-6xl mx-auto mt-16 md:mt-20 lg:mt-24 px-4 md:px-0">
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
                    I offer tailored experiences for individuals, groups, and
                    organizations seeking deep transformation through sound
                    healing, yoga, and meditation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto mt-16 md:mt-20 lg:mt-24 px-4 md:px-0">
            <h2 className="text-[32px] pb-[70px]  sm:text-[36px] md:text-[40px]  text-[#D5B584] font-light leading-tight">
              For Corporate & Group
            </h2>
            {sessionsLoading ? (
              <div className="text-center py-12 text-[#D5B584]">Loading sessions...</div>
            ) : corporateSessions.length === 0 ? (
              <div className="text-center py-12 text-[#6B5D4F]">No corporate sessions available.</div>
            ) : (
              <div className="relative">
                {/* Carousel Container */}
                <div className="overflow-hidden">
                  <div
                    className="flex gap-3 sm:gap-4 transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${
                        corporateCurrentIndex * (100 / 3)
                      }%)`
                    }}
                  >
                    {corporateSessions.map((item) => (
                      <div
                        key={item._id}
                        className="min-w-[calc(100%/3-0.67rem)] sm:min-w-[calc(100%/3-0.89rem)] flex-shrink-0"
                      >
                        <div className="relative group overflow-hidden rounded-[20px] h-[400px] sm:h-[450px] md:h-[640px] w-full">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.title || `Corporate & Group ${item._id}`}
                              width={500}
                              height={500}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#D5B584]/20 to-[#D5B584]/40 flex items-center justify-center">
                              <span className="text-[#D5B584] text-lg">No Image</span>
                            </div>
                          )}
                          {/* Default Overlay with Title and Button */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 sm:p-5 md:p-6 group-hover:opacity-0 transition-opacity duration-300">
                            <h3 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-normal mb-3 leading-snug">
                              {item.title || "Corporate Session"}
                            </h3>
                            <button 
                              onClick={() => router.push('/form')}
                              className="flex items-center gap-2 text-white text-[14px] sm:text-[15px] font-light hover:gap-3 transition-all duration-300"
                            >
                              Enquire Now
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 12H19M19 12L12 5M19 12L12 19"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Hover Overlay with Details */}
                          <div className="absolute inset-0 bg-black/70 p-6 sm:p-8 md:p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between overflow-y-auto">
                            <div className="space-y-4 sm:space-y-5 md:space-y-6">
                              {item.description && (
                                <div>
                                  <h4 className="text-[#D5B584] text-[14px] sm:text-[15px] md:text-[16px] font-normal mb-2">
                                    Description:
                                  </h4>
                                  <p className="text-white text-[12px] sm:text-[13px] md:text-[14px] font-light leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>
                              )}

                              {item.format && (
                                <div>
                                  <h4 className="text-[#D5B584] text-[14px] sm:text-[15px] md:text-[16px] font-normal mb-2">
                                    Format:
                                  </h4>
                                  <p className="text-white text-[12px] sm:text-[13px] md:text-[14px] font-light">
                                    {item.format}
                                  </p>
                                </div>
                              )}

                              {item.benefits && item.benefits.length > 0 && (
                                <div>
                                  <h4 className="text-[#D5B584] text-[14px] sm:text-[15px] md:text-[16px] font-normal mb-2">
                                    Benefits:
                                  </h4>
                                  <ul className="space-y-2">
                                    {item.benefits.map((benefit, index) => (
                                      <li
                                        key={index}
                                        className="text-white text-[12px] sm:text-[13px] md:text-[14px] font-light flex items-start gap-2"
                                      >
                                        <span className="text-[#D5B584] mt-1">•</span>
                                        <span>{benefit}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            <button 
                              onClick={() => router.push('/form')}
                              className="flex items-center gap-2 text-white text-[14px] sm:text-[15px] font-light hover:gap-3 transition-all duration-300 mt-6"
                            >
                              Enquire Now
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 12H19M19 12L12 5M19 12L12 19"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Arrows */}
                {corporateSessions.length > 0 && (
                  <>
                    <button
                      onClick={handleCorporatePrev}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 z-10"
                      aria-label="Previous slide"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 18L9 12L15 6"
                          stroke="#D5B584"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleCorporateNext}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 z-10"
                      aria-label="Next slide"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="#D5B584"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </>
                )}

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-6">
                  {corporateSessions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCorporateCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === corporateCurrentIndex
                          ? "bg-[#D5B584] w-8"
                          : "bg-[#D5B584]/30"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="max-w-6xl  mx-auto mt-16 md:mt-20 lg:mt-24 px-4 md:px-0">
            <h2 className="text-[32px] pb-[70px]  sm:text-[36px] md:text-[40px]  text-[#D5B584] font-light leading-tight">
              Private & Group Offerings
            </h2>
            {sessionsLoading ? (
              <div className="text-center py-12 text-[#D5B584]">Loading sessions...</div>
            ) : privateSessions.length === 0 ? (
              <div className="text-center py-12 text-[#6B5D4F]">No private sessions available.</div>
            ) : (
              <div className="relative">
                {/* Carousel Container */}
                <div className="overflow-hidden">
                  <div
                    className="flex gap-3 sm:gap-4 transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${
                        privateCurrentIndex * (100 / 3)
                      }%)`
                    }}
                  >
                    {privateSessions.map((item) => (
                      <div
                        key={item._id}
                        className="min-w-[calc(100%/3-0.67rem)] sm:min-w-[calc(100%/3-0.89rem)] flex-shrink-0"
                      >
                        <div className="relative group overflow-hidden rounded-[20px] h-[400px] sm:h-[450px] md:h-[640px] w-full">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.title || `Private & Group ${item._id}`}
                              width={500}
                              height={500}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#D5B584]/20 to-[#D5B584]/40 flex items-center justify-center">
                              <span className="text-[#D5B584] text-lg">No Image</span>
                            </div>
                          )}
                          {/* Default Overlay with Title and Button */}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/30 to-transparent p-4 sm:p-5 md:p-6 group-hover:opacity-0 transition-opacity duration-300">
                            <h3 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-normal mb-3 leading-snug">
                              {item.title || "Private Session"}
                            </h3>
                            <button 
                              onClick={() => router.push('/calendar?type=private')}
                              className="flex items-center gap-2 text-white text-[14px] sm:text-[15px] font-light hover:gap-3 transition-all duration-300"
                            >
                              Book Now
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 12H19M19 12L12 5M19 12L12 19"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Hover Overlay with Details */}
                          <div className="absolute inset-0 bg-black/40 p-6 sm:p-8 md:p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between overflow-y-auto">
                            <div className="space-y-4 sm:space-y-5 md:space-y-6">
                              {item.description && (
                                <div>
                                  <h4 className="text-[#D5B584] text-[14px] sm:text-[15px] md:text-[16px] font-normal mb-2">
                                    Description:
                                  </h4>
                                  <p className="text-white text-[12px] sm:text-[13px] md:text-[14px] font-light leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>
                              )}

                              {item.format && (
                                <div>
                                  <h4 className="text-[#D5B584] text-[14px] sm:text-[15px] md:text-[16px] font-normal mb-2">
                                    Format:
                                  </h4>
                                  <p className="text-white text-[12px] sm:text-[13px] md:text-[14px] font-light">
                                    {item.format}
                                  </p>
                                </div>
                              )}

                              {item.benefits && item.benefits.length > 0 && (
                                <div>
                                  <h4 className="text-[#D5B584] text-[14px] sm:text-[15px] md:text-[16px] font-normal mb-2">
                                    Benefits:
                                  </h4>
                                  <ul className="space-y-2">
                                    {item.benefits.map((benefit, index) => (
                                      <li
                                        key={index}
                                        className="text-white text-[12px] sm:text-[13px] md:text-[14px] font-light flex items-start gap-2"
                                      >
                                        <span className="text-[#D5B584] mt-1">•</span>
                                        <span>{benefit}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            <button 
                              onClick={() => router.push('/form')}
                              className="flex items-center gap-2 text-white text-[14px] sm:text-[15px] font-light hover:gap-3 transition-all duration-300 mt-6"
                            >
                              Book Now
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 12H19M19 12L12 5M19 12L12 19"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Arrows */}
                {privateSessions.length > 0 && (
                  <>
                    <button
                      onClick={handlePrivatePrev}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 z-10"
                      aria-label="Previous slide"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 18L9 12L15 6"
                          stroke="#D5B584"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handlePrivateNext}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 z-10"
                      aria-label="Next slide"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="#D5B584"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </>
                )}

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-6">
                  {privateSessions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setPrivateCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === privateCurrentIndex
                          ? "bg-[#D5B584] w-8"
                          : "bg-[#D5B584]/30"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ServicesPage;
