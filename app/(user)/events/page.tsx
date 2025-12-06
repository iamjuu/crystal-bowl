"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import { About1 } from "@/public/assets";
import { ArrowRight } from "lucide-react";

type ApiEvent = {
  _id: string;
  name: string;
  title: string;
  location: string;
  day: string;
  time: string;
  date: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

type DisplayEvent = {
  id: string;
  date: {
    month: string;
    day: string;
  };
  image: string | typeof About1;
  title: string;
  location: string;
  time: string;
  description: string;
};

const EventsPage = () => {
  const [eventsData, setEventsData] = useState<DisplayEvent[]>([]);
  const [pastEventsData, setPastEventsData] = useState<DisplayEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to parse date and extract month and day
  const parseDate = (dateString: string): { month: string; day: string } => {
    try {
      const date = new Date(dateString);
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return {
        month: months[date.getMonth()] || "Unknown",
        day: date.getDate().toString().padStart(2, "0")
      };
    } catch {
      // Fallback if date parsing fails
      const parts = dateString.split("-");
      if (parts.length >= 2) {
        const monthNum = parseInt(parts[1], 10);
        const months = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        return {
          month: months[monthNum - 1] || "Unknown",
          day: parts[2] || "01"
        };
      }
      return { month: "Unknown", day: "01" };
    }
  };

  // Helper function to get image URL
  const getImageUrl = (imageUrl?: string): string | typeof About1 => {
    if (!imageUrl) return About1;
    if (imageUrl.startsWith("data:image")) return imageUrl;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
    return `data:image/jpeg;base64,${imageUrl}`;
  };

  // Helper function to format time with day
  const formatTime = (day: string, time: string): string => {
    return `${day} ${time}`;
  };


  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events");
      const data = await response.json();
      
      if (data.success && data.data) {
        const apiEvents: ApiEvent[] = data.data;
        
        // Transform API events to display format
        const transformedEvents: DisplayEvent[] = apiEvents.map((event) => ({
          id: event._id,
          date: parseDate(event.date),
          image: getImageUrl(event.imageUrl),
          title: event.title,
          location: event.location,
          time: formatTime(event.day, event.time),
          description: event.description
        }));

        // Separate into upcoming and past events
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = transformedEvents.filter((event) => {
          try {
            const eventDate = new Date(apiEvents.find(e => e._id === event.id)?.date || "");
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= today;
          } catch {
            return true; // Include if date parsing fails
          }
        });

        const past = transformedEvents.filter((event) => {
          try {
            const eventDate = new Date(apiEvents.find(e => e._id === event.id)?.date || "");
            eventDate.setHours(0, 0, 0, 0);
            return eventDate < today;
          } catch {
            return false;
          }
        });

        setEventsData(upcoming);
        setPastEventsData(past);
      } else {
        setEventsData([]);
        setPastEventsData([]);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setEventsData([]);
      setPastEventsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className=" bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
      <Navbar />
      <div className="w-full ">
        <section className="w-full px-4 md:px-0 py-[68px]">
          <div className="max-w-6xl pb-[106px]  mx-auto">
            {/* Header Section */}
            <div className="mb-12 flex gap-[48px] md:mb-16">
              <h1 className="text-[#D5B584] text-[36px] sm:text-[40px]  font-light mb-4">
                Events
              </h1>
              <p className="text-[#1C3163] text-[14px] sm:text-[15px] md:text-[16px] font-light max-w-md">
                Lorem ipsum dolor sit amet consectetur. Eu proin donec est ac
                velit massa et lobortis.
              </p>
            </div>

            {/* Events List */}
            {loading ? (
              <div className="text-center py-12 text-[#1C3163]">Loading events...</div>
            ) : eventsData.length === 0 ? (
              <div className="text-center py-12 text-[#1C3163]">No upcoming events</div>
            ) : (
              <div className="">
                {eventsData.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="flex py-[50px] border-b border-[#D5B584] flex-col lg:flex-row gap-8 lg:gap-12 hover:bg-white/10 transition-colors duration-300  px-4 -mx-4"
                  >
                  {/* Date Section */}
                  <div className="lg:w-[150px] flex-shrink-0">
                    <div className="text-[#D5B584]">
                      <p className="text-[18px] sm:text-[20px] md:text-[30px] font-light">
                        {event.date.month}
                      </p>
                      <p className="text-[64px] sm:text-[72px] md:text-[80px] lg:text-[64px] font-light leading-none">
                        {event.date.day}
                      </p>
                    </div>
                  </div>

                  {/* Event Card */}
                  <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-8 group/card">
                    {/* Event Image */}
                    <div className="md:w-[45%] lg:w-[40%] flex-shrink-0">
                      <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden group/image">
                        {typeof event.image === "string" ? (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500 ease-out"
                          />
                        ) : (
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover group-hover/image:scale-110 transition-transform duration-500 ease-out"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 ease-out pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-[#1C3163] text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] font-normal mb-4 leading-tight group-hover/card:text-[#D5B584] transition-colors duration-300">
                          {event.title}
                        </h2>

                        <div className="space-y-2 mb-4">
                          <p className="text-[#1C3163] text-[14px] sm:text-[15px] md:text-[16px] font-normal">
                            {event.location}
                          </p>
                          <p className="text-[#1C3163] text-[14px] sm:text-[15px] md:text-[16px] font-light">
                            {event.time}
                          </p>
                        </div>

                        <p className="text-[#6B5D4F] text-[14px] sm:text-[15px] md:text-[16px] font-light leading-relaxed mb-6">
                          {event.description}
                        </p>
                      </div>

                      {/* View Details Button */}
                      <button className="flex items-center gap-2 text-[#1C3163] text-[14px] sm:text-[15px] md:text-[16px] font-normal hover:gap-3 transition-all duration-300 group w-fit">
                        View Event Details
                        <ArrowRight
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>
                  </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-12 flex gap-[48px] md:mb-16">
              <h1 className="text-[#D5B584] text-[36px] sm:text-[40px]  font-light mb-4">
                Past Events
              </h1>
              <p className="text-[#1C3163] text-[14px] sm:text-[15px] md:text-[16px] font-light max-w-md">
                Lorem ipsum dolor sit amet consectetur. Eu proin donec est ac
                velit massa et lobortis.
              </p>
            </div>

            {/* Events List */}
            {loading ? (
              <div className="text-center py-12 text-[#1C3163]">Loading events...</div>
            ) : pastEventsData.length === 0 ? (
              <div className="text-center py-12 text-[#1C3163]">No past events</div>
            ) : (
              <div className="">
                {pastEventsData.map((event) => (
                  <div
                    key={event.id}
                    className="flex py-[50px] border-b border-[#D5B584] flex-col lg:flex-row gap-8 lg:gap-12 hover:bg-white/10 transition-colors duration-300 rounded-lg px-4 -mx-4"
                  >
                  {/* Date Section */}
                  <div className="lg:w-[150px] flex-shrink-0">
                    <div className="text-[#D5B584]">
                      <p className="text-[18px] sm:text-[20px] md:text-[30px] font-light">
                        {event.date.month}
                      </p>
                      <p className="text-[64px] sm:text-[72px] md:text-[80px] lg:text-[64px] font-light leading-none">
                        {event.date.day}
                      </p>
                    </div>
                  </div>

                  {/* Event Card */}
                  <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-8 group/card">
                    {/* Event Image */}
                    <div className="md:w-[45%] lg:w-[40%] flex-shrink-0">
                      <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden group/image">
                        {typeof event.image === "string" ? (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover grayscale group-hover/image:grayscale-0 group-hover/image:scale-110 transition-all duration-500 ease-out"
                          />
                        ) : (
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover grayscale group-hover/image:grayscale-0 group-hover/image:scale-110 transition-all duration-500 ease-out"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 ease-out pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-[#1C3163] text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] font-normal mb-4 leading-tight group-hover/card:text-[#D5B584] transition-colors duration-300">
                          {event.title}
                        </h2>

                        <div className="space-y-2 mb-4">
                          <p className="text-[#1C3163] text-[14px] sm:text-[15px] md:text-[16px] font-normal">
                            {event.location}
                          </p>
                          <p className="text-[#1C3163] text-[14px] sm:text-[15px] md:text-[16px] font-light">
                            {event.time}
                          </p>
                        </div>

                        <p className="text-[#6B5D4F] text-[14px] sm:text-[15px] md:text-[16px] font-light leading-relaxed mb-6">
                          {event.description}
                        </p>
                      </div>

                      {/* View Details Button */}
                      <button className="flex items-center gap-2 text-[#1C3163] text-[14px] sm:text-[15px] md:text-[16px] font-normal hover:gap-3 transition-all duration-300 group w-fit">
                        View Event Details
                        <ArrowRight
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>
                  </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default EventsPage;
