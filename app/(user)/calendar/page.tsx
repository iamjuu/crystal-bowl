'use client'

import React, { useState } from 'react'
import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Generate calendar days for current month
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const calendarDays = [
    [26, 27, 28, 29, 30, 1, 2],
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30],
  ]

  const timeSlots = [
    { time: '17:00', available: true, highlighted: false },
    { time: '17:30', available: false, highlighted: false },
    { time: '17:00', available: true, highlighted: true },
    { time: '17:00', available: true, highlighted: true },
    { time: '17:00', available: true, highlighted: true },
    { time: '17:00', available: true, highlighted: true },
  ]

  const handleDateClick = (day: number) => {
    if (day >= 1 && day <= 30) {
      setSelectedDate(day)
    }
  }

  const handleTimeClick = (time: string, available: boolean) => {
    if (available) {
      setSelectedTime(time)
    }
  }

  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      alert(`Booking confirmed for day ${selectedDate} at ${selectedTime}`)
    } else {
      alert('Please select both date and time')
    }
  }

  return (
    <>
      <Navbar />
      <div className="w-full bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
        <section className="w-full px-4 md:px-0 py-[68px]">
          <div className="max-w-6xl pb-[106px] mx-auto">
            {/* Header */}
            <div className="mb-8 md:mb-12">
              <h1 className="text-[32px] sm:text-[36px] md:text-[40px]  text-[#D5B584] font-light leading-tight mb-3">
                Schedule Your Call
              </h1>
              <p className="text-[16px] sm:text-[18px] md:text-[20px] text-[#5B7C99] font-light">
                Check Out Our Availability And Book The Date And Time That Works For You
              </p>
            </div>

            {/* Calendar and Time Selection Container */}
            <div className="rounded-[24px] p-6 md:p-8 lg:p-10 border">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Left side - Calendar */}
                <div className="w-full lg:w-1/2">
                  <h3 className="text-[18px] sm:text-[20px] md:text-[22px] text-[#5B7C99] font-normal mb-6">
                    Select Date & Time
                  </h3>

                  <div className="bg-white/50 border-2 border-[#E5E7EB] rounded-[16px] p-4">
                    {/* Days of Week Header */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {daysOfWeek.map((day) => (
                        <div
                          key={day}
                          className="text-center text-[12px] sm:text-[14px] text-[#6B7280] font-medium py-2"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="flex flex-col gap-1">
                      {calendarDays.map((week, weekIndex) => (
                        <div key={weekIndex} className="grid grid-cols-7 gap-1">
                          {week.map((day, dayIndex) => {
                            const isCurrentMonth = day >= 1 && day <= 30
                            const isPastDate = day < 26 && weekIndex === 0
                            const isSelected = selectedDate === day

                            return (
                              <button
                                key={dayIndex}
                                onClick={() => handleDateClick(day)}
                                disabled={!isCurrentMonth || isPastDate}
                                className={`
                                  aspect-square rounded-lg text-[14px] sm:text-[16px] font-medium
                                  transition-all duration-200
                                  ${
                                    isSelected
                                      ? 'bg-[#EF4444] text-white'
                                      : isCurrentMonth && !isPastDate
                                      ? 'bg-[#1E3A8A] text-white hover:bg-[#1E40AF]'
                                      : 'bg-[#374151] text-[#9CA3AF] cursor-not-allowed'
                                  }
                                `}
                              >
                                {day}
                              </button>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side - Time Slots */}
                <div className="w-full lg:w-1/2">
                  <h3 className="text-[18px] sm:text-[20px] md:text-[22px] text-[#5B7C99] font-normal mb-6">
                    Time Zone: Singapore Standard Time (SMT +8)
                  </h3>

                  {/* Time Slots Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                    {timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleTimeClick(slot.time, slot.available)}
                        disabled={!slot.available}
                        className={`
                          py-4 px-6 rounded-lg text-[16px] sm:text-[18px] font-medium
                          transition-all duration-200
                          ${
                            selectedTime === slot.time && index === 0
                              ? 'bg-[#EF4444] text-white'
                              : slot.available && slot.highlighted
                              ? 'bg-[#1E3A8A] text-white hover:bg-[#1E40AF]'
                              : slot.available
                              ? 'bg-[#8B7355] text-white hover:bg-[#9d8264]'
                              : 'bg-[#9CA3AF] text-white cursor-not-allowed opacity-60'
                          }
                        `}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center lg:justify-start">
                    <button
                      onClick={handleSubmit}
                      className="bg-[#D5B584] text-white px-12 py-4 rounded-lg text-[16px] sm:text-[18px] font-medium hover:bg-[#C4A574] transition-colors duration-300 shadow-md"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default CalendarPage

