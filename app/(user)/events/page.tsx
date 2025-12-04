"use client";

import React from "react";
import Image from "next/image";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import { About1, About2, About3, Yoga1, Yoga2, Yoga3 } from "@/public/assets";
import { ArrowRight } from "lucide-react";

const EventsPage = () => {
  const eventsData = [
    {
      id: 1,
      date: {
        month: "May",
        day: "15"
      },
      image: About1,
      title: "Full Moon Sound Healing Journey",
      location: "Rishikesh, Uttarakhand, India",
      time: "Friday 07:00PM - 10:00PM",
      description:
        "Experience a transformative sound healing session under the full moon. Immerse yourself in the resonant frequencies of crystal bowls, gongs, and Tibetan singing bowls as you journey deep into relaxation and inner peace."
    },
    {
      id: 2,
      date: {
        month: "May",
        day: "22"
      },
      image: Yoga1,
      title: "Sunrise Vinyasa Flow Retreat",
      location: "Goa, India",
      time: "Saturday 06:00AM - 08:00AM",
      description:
        "Start your day with an energizing vinyasa flow practice at sunrise. This dynamic yoga session combines breathwork, flowing sequences, and meditation to awaken your body and mind."
    },
    {
      id: 3,
      date: {
        month: "June",
        day: "05"
      },
      image: About2,
      title: "Crystal Bowl Meditation Workshop",
      location: "Singapore Studio",
      time: "Sunday 02:00PM - 04:00PM",
      description:
        "Learn the art of crystal bowl meditation in this immersive workshop. Discover how to use crystal bowls for healing, meditation, and creating sacred space in your practice."
    },
    {
      id: 4,
      date: {
        month: "June",
        day: "18"
      },
      image: Yoga2,
      title: "Yin Yoga & Sound Bath Experience",
      location: "Bali, Indonesia",
      time: "Friday 06:00PM - 08:30PM",
      description:
        "Combine the deep stretches of yin yoga with the healing vibrations of sound therapy. This restorative practice helps release tension, improve flexibility, and promote deep relaxation."
    },
    {
      id: 5,
      date: {
        month: "July",
        day: "10"
      },
      image: About3,
      title: "New Moon Intention Setting Ceremony",
      location: "Online Event",
      time: "Wednesday 08:00PM - 09:30PM",
      description:
        "Join us for a sacred new moon ceremony where we'll set intentions, practice guided meditation, and use sound healing to align with the lunar energy for manifestation and renewal."
    },
    {
      id: 6,
      date: {
        month: "July",
        day: "25"
      },
      image: Yoga3,
      title: "Corporate Wellness Sound Healing",
      location: "Corporate Office, Singapore",
      time: "Thursday 12:00PM - 01:00PM",
      description:
        "Bring the healing power of sound to your workplace. This lunchtime session is designed to reduce stress, improve focus, and enhance team well-being through guided sound meditation."
    }
  ];

  const pastEventsData = [
    {
      id: 1,
      date: {
        month: "March",
        day: "20"
      },
      image: About1,
      title: "Spring Equinox Sound Healing",
      location: "Rishikesh, Uttarakhand, India",
      time: "Wednesday 07:00PM - 09:00PM",
      description:
        "Celebrated the spring equinox with a special sound healing ceremony. Participants experienced deep relaxation and renewal as we honored the balance of light and dark."
    },
    {
      id: 2,
      date: {
        month: "February",
        day: "14"
      },
      image: Yoga1,
      title: "Valentine's Day Partner Yoga & Sound",
      location: "Singapore Studio",
      time: "Wednesday 06:00PM - 08:00PM",
      description:
        "A special couples event combining partner yoga poses with sound healing. Couples explored connection, trust, and harmony through movement and vibration."
    },
    {
      id: 3,
      date: {
        month: "January",
        day: "01"
      },
      image: About2,
      title: "New Year Sound Healing & Intention Setting",
      location: "Online Event",
      time: "Monday 10:00PM - 12:00AM",
      description:
        "Welcomed the new year with a powerful sound healing session and intention-setting ceremony. Participants set their intentions for 2024 while being bathed in healing frequencies."
    }
  ];

  return (
    <div className=" bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
      <Navbar />
      <div className="w-full ">
        <section className="w-full px-4 md:px-0 py-[68px]">
          <div className="max-w-6xl pb-[106px] border-b mx-auto">
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
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover group-hover/image:scale-110 transition-transform duration-500 ease-out"
                        />
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
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover grayscale group-hover/image:grayscale-0 group-hover/image:scale-110 transition-all duration-500 ease-out"
                        />
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
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default EventsPage;
