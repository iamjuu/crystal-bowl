"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import { About1, Yoga1 } from "@/public/assets";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

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

type ApiPastEvent = {
  _id: string;
  name: string;
  title: string;
  location: string;
  day: string;
  time: string;
  date: string;
  description: string;
  thumbnailImage: string;
  photos?: string[];
  videos?: string[];
  createdAt: string;
  updatedAt: string;
};

const EventsPage = () => {
  const [eventsData, setEventsData] = useState<DisplayEvent[]>([]);
  const [pastEventsData, setPastEventsData] = useState<DisplayEvent[]>([]);
  const [pastEventsFromAPI, setPastEventsFromAPI] = useState<ApiPastEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [pastEventsLoading, setPastEventsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4; // Show 4 items per page for horizontal scroll

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

  // Fetch past events from PastEvent collection
  const fetchPastEvents = async () => {
    try {
      setPastEventsLoading(true);
      const response = await fetch("/api/past-events");
      const data = await response.json();
      
      if (data.success && data.data) {
        const apiPastEvents: ApiPastEvent[] = data.data;
        setPastEventsFromAPI(apiPastEvents);
        
        // Transform API past events to display format
        const transformedPastEvents: DisplayEvent[] = apiPastEvents.map((event) => ({
          id: event._id,
          date: parseDate(event.date),
          image: getImageUrl(event.thumbnailImage),
          title: event.title,
          location: event.location,
          time: formatTime(event.day, event.time),
          description: event.description
        }));
        
        setPastEventsData(transformedPastEvents);
      } else {
        setPastEventsFromAPI([]);
        setPastEventsData([]);
      }
    } catch (error) {
      console.error("Failed to fetch past events:", error);
      setPastEventsFromAPI([]);
      setPastEventsData([]);
    } finally {
      setPastEventsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchPastEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate pagination for past events
  const totalPages = Math.ceil(pastEventsData.length / itemsPerPage);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && scrollContainerRef.current) {
      const newPage = currentPage + 1;
      const container = scrollContainerRef.current;
      const scrollPosition = newPage * container.clientWidth;
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      setCurrentPage(newPage);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && scrollContainerRef.current) {
      const newPage = currentPage - 1;
      const container = scrollContainerRef.current;
      const scrollPosition = newPage * container.clientWidth;
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      setCurrentPage(newPage);
    }
  };

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
              {/* <p className="text-[#1C3163] text-[14px] sm:text-[15px] md:text-[16px] font-light max-w-md">
                Lorem ipsum dolor sit amet consectetur. Eu proin donec est ac
                velit massa et lobortis.
              </p> */}
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

          <div className="max-w-6xl mx-auto px-4">
            {/* Header Section */}
            <div className="mb-12 flex gap-[48px] md:mb-16">
              <h2 className="text-[#D5B584] text-[28px] sm:text-[32px] md:text-[40px] font-normal">
                Past Events
              </h2>
            </div>

            {/* Past Events - Horizontal Scroll with Pagination */}
            {pastEventsLoading ? (
              <div className="relative overflow-x-hidden">
                {/* Shimmer Loaders - Horizontal scroll layout */}
                <div className="flex gap-6 md:gap-8">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex flex-col group flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
                      <div className="relative w-full aspect-[4/3] overflow-hidden mb-0 bg-gradient-to-r from-[#D5B584]/20 via-[#D5B584]/40 to-[#D5B584]/20 rounded-lg">
                        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                      </div>
                      <div className="px-4 py-5 md:px-5 md:py-6 -mt-2 relative z-10">
                        <div className="h-5 bg-[#8B6F47]/20 rounded mb-2 relative overflow-hidden">
                          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                        </div>
                        <div className="h-4 bg-[#8B6F47]/20 rounded w-3/4 relative overflow-hidden">
                          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : pastEventsData.length === 0 ? (
              <div className="text-center py-12 text-[#1C3163]">
                <p className="text-[16px]">No past events available</p>
              </div>
            ) : (
              <div className="relative">
                {/* Past Events - Horizontal Scroll Container */}
                <div 
                  ref={scrollContainerRef}
                  className="relative overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide"
                  onScroll={(e) => {
                    const container = e.currentTarget;
                    const scrollLeft = container.scrollLeft;
                    const containerWidth = container.clientWidth;
                    const page = Math.round(scrollLeft / containerWidth);
                    if (page !== currentPage) {
                      setCurrentPage(page);
                    }
                  }}
                >
                  <div className="flex">
                    {Array.from({ length: totalPages }).map((_, pageIndex) => (
                      <div 
                        key={pageIndex} 
                        className="flex gap-6 md:gap-8 flex-shrink-0 snap-start w-full"
                      >
                        {pastEventsData.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((event) => {
                          const eventDate = new Date(pastEventsFromAPI.find(e => e._id === event.id)?.date || "");
                          const monthNames = [
                            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                          ];
                          const monthAbbr = monthNames[eventDate.getMonth()];
                          const dayNumber = eventDate.getDate();
                          const year = eventDate.getFullYear();

                          // Format date for display: "Nov 7, 2025"
                          const formattedFullDate = `${monthAbbr} ${dayNumber}, ${year}`;

                          // Format time if available
                          const apiEvent = pastEventsFromAPI.find(e => e._id === event.id);
                          const timeDisplay = apiEvent?.time ? ` · ${apiEvent.time}` : "";

                          return (
                            <div key={event.id} className="flex flex-col group flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
                              <Link href={`/past-events/${event.id}`}>
                                <div className="relative w-full aspect-[4/3] overflow-hidden mb-0 group-hover:shadow-2xl transition-all duration-500">
                                  {typeof event.image === "string" ? (
                                    <img
                                      src={event.image}
                                      alt={event.title}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ease-out"
                                    />
                                  ) : (
                                    <Image
                                      src={event.image}
                                      alt={event.title}
                                      fill
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      className="object-cover group-hover:scale-110 transition-all duration-500 ease-out"
                                    />
                                  )}
                                  {/* Date Badge - Upper Right Corner */}
                                  <div className="absolute top-2 right-2 bg-white px-3 py-2 text-center shadow-lg">
                                    <div className="text-[#1C3163] text-[10px] sm:text-[11px] font-medium uppercase leading-tight">
                                      {monthAbbr}
                                    </div>
                                    <div className="text-[#1C3163] text-[18px] sm:text-[20px] md:text-[24px] font-semibold leading-tight">
                                      {dayNumber}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                              {/* Event Details - Light Beige Background */}
                              <div className="px-4 py-5 md:px-5 md:py-6 -mt-2 relative z-10">
                                <h3 className="text-[#8B6F47] text-[14px] sm:text-[15px] md:text-[18px] font-normal leading-tight mb-2 uppercase tracking-wide">
                                  {event.title}
                                </h3>
                                <p className="text-[#8B6F47] text-[12px] sm:text-[13px] md:text-[14px] font-light">
                                  {formattedFullDate}
                                  {timeDisplay}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                      className="flex items-center justify-center rounded-full bg-white/90 hover:bg-white p-3 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#D5B584]" />
                    </button>
                    <span className="text-[#1C3163] text-sm">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages - 1}
                      className="flex items-center justify-center rounded-full bg-white/90 hover:bg-white p-3 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-5 h-5 text-[#D5B584]" />
                    </button>
                  </div>
                )}
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
