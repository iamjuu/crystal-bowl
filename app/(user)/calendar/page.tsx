'use client'

import React, { useState, useMemo } from 'react'
import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  // Generate calendar days for current month
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()
    const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
    
    type CalendarDay = { day: number; isCurrentMonth: boolean }
    const days: CalendarDay[][] = []
    let currentWeek: CalendarDay[] = []
    
    // Add days from previous month
    const prevMonth = new Date(currentYear, currentMonth, 0)
    const prevMonthDays = prevMonth.getDate()
    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push({
        day: prevMonthDays - startingDayOfWeek + i + 1,
        isCurrentMonth: false
      })
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push({
        day,
        isCurrentMonth: true
      })
      if (currentWeek.length === 7) {
        days.push(currentWeek)
        currentWeek = []
      }
    }
    
    // Add days from next month to fill the last week
    let nextMonthDay = 1
    while (currentWeek.length < 7) {
      currentWeek.push({
        day: nextMonthDay,
        isCurrentMonth: false
      })
      nextMonthDay++
    }
    if (currentWeek.length > 0) {
      days.push(currentWeek)
    }
    
    return days
  }, [currentMonth, currentYear])

  const timeSlots = [
    { time: '09:00', available: true },
    { time: '10:00', available: false },
    { time: '11:00', available: true },
    { time: '12:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: true },
    { time: '17:00', available: false },
    { time: '18:00', available: true },
  ]

  const handleDateClick = (day: number | null, isCurrentMonth: boolean) => {
    if (day !== null && isCurrentMonth) {
      const today = new Date()
      const selectedDateObj = new Date(currentYear, currentMonth, day)
      const todayDateObj = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      
      // Only allow selection of today or future dates
      if (selectedDateObj >= todayDateObj) {
        setSelectedDate(day)
      }
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
    <div className=' bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen'>
      <Navbar />
      <div className="w-full">
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
                          {week.map((calendarDay, dayIndex) => {
                            const today = new Date()
                            const { day, isCurrentMonth } = calendarDay
                            
                            // Check if date is in the past
                            let isPastDate = false
                            if (isCurrentMonth) {
                              const selectedDateObj = new Date(currentYear, currentMonth, day)
                              const todayDateObj = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                              isPastDate = selectedDateObj < todayDateObj
                            }
                            
                            const isSelected = selectedDate === day && isCurrentMonth

                            return (
                              <button
                                key={dayIndex}
                                onClick={() => handleDateClick(day, isCurrentMonth)}
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
                    {timeSlots.map((slot, index) => {
                      const isSelected = selectedTime === slot.time
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handleTimeClick(slot.time, slot.available)}
                          disabled={!slot.available}
                          className={`
                            py-4 px-6 rounded-lg text-[16px] sm:text-[18px] font-medium
                            transition-all duration-200
                            ${
                              isSelected
                                ? 'bg-[#EF4444] text-white'
                                : slot.available
                                ? 'bg-[#1E3A8A] text-white hover:bg-[#EF4444]'
                                : 'bg-[#9CA3AF] text-white cursor-not-allowed opacity-60'
                            }
                          `}
                        >
                          {slot.time}
                        </button>
                      )
                    })}
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
    </div>
  )
}

export default CalendarPage

