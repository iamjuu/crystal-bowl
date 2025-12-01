'use client'

import React from 'react'
import Image from 'next/image'
import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'
import { About1 } from '@/public/assets'
import { ArrowRight } from 'lucide-react'

const EventsPage = () => {
  const eventsData = [
    {
      id: 1,
      date: {
        month: "April",
        day: "07"
      },
      image: About1,
      title: "Full Moon Sound Healing Journey",
      location: "Rishikesh, Uttarakhand, India",
      time: "Monday 09:00PM - 03:00AM",
      description: "Lorem ipsum dolor sit amet consectetur. Eu proin donec est ac velit massa et lobortis."
    },
    {
        id: 2,
        date: {
          month: "April",
          day: "07"
        },
        image: About1,
        title: "Full Moon Sound Healing Journey",
        location: "Rishikesh, Uttarakhand, India",
        time: "Monday 09:00PM - 03:00AM",
        description: "Lorem ipsum dolor sit amet consectetur. Eu proin donec est ac velit massa et lobortis."
      },
      {
        id: 3,
        date: {
          month: "April",
          day: "07"
        },
        image: About1,
        title: "Full Moon Sound Healing Journey",
        location: "Rishikesh, Uttarakhand, India",
        time: "Monday 09:00PM - 03:00AM",
        description: "Lorem ipsum dolor sit amet consectetur. Eu proin donec est ac velit massa et lobortis."
      },
    // Add more events as needed
  ]

  return (
    <>
      <Navbar />
      <div className="w-full bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
      <section className="w-full px-4 md:px-0 py-[68px]">
      <div className="max-w-6xl pb-[106px] border-b mx-auto">
            {/* Header Section */}
            <div className="mb-12 flex gap-[48px] md:mb-16">
              <h1 className="text-[#D5B584] text-[36px] sm:text-[40px]  font-light mb-4">
                Events
              </h1>
              <p className="text-[#1C3163] text-[14px] sm:text-[15px] md:text-[16px] font-light max-w-md">
                Lorem ipsum dolor sit amet consectetur. Eu proin donec est ac velit massa et lobortis.
              </p>
            </div>

            {/* Events List */}
            <div className="">
              {eventsData.map((event) => (
                <div key={event.id} className="flex py-[50px] border-b border-[#D5B584] flex-col lg:flex-row gap-8 lg:gap-12">
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
                  <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Event Image */}
                    <div className="md:w-[45%] lg:w-[40%] flex-shrink-0">
                      <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-[#1C3163] text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] font-normal mb-4 leading-tight">
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
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
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
                Lorem ipsum dolor sit amet consectetur. Eu proin donec est ac velit massa et lobortis.
              </p>
            </div>

            {/* Events List */}
            <div className="">
              {eventsData.map((event) => (
                <div key={event.id} className="flex py-[50px] border-b border-[#D5B584] flex-col lg:flex-row gap-8 lg:gap-12">
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
                  <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Event Image */}
                    <div className="md:w-[45%] lg:w-[40%] flex-shrink-0">
                      <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-[#1C3163] text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] font-normal mb-4 leading-tight">
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
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
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
    </>
  )
}

export default EventsPage
