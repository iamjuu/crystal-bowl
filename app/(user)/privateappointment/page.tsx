'use client'

import React, { useMemo, useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'

type AvailableSlot = {
  _id: string
  sessionType: string
  month: string
  date: string
  time: string
  isBooked: boolean
}

const PrivateAppointmentPage = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  
  // Ref for scrolling to form
  const formRef = useRef<HTMLDivElement>(null)
  
  // Available slots state
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(true)
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Payment options state
  const [showMorePayments, setShowMorePayments] = useState(false)

  // Fetch available slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoadingSlots(true)
        const response = await fetch('/api/slots?sessionType=private')
        const data = await response.json()
        
        if (data.success) {
          setAvailableSlots(data.data || [])
        } else {
          console.error('Failed to fetch slots:', data.message)
          toast.error('Failed to load available slots')
        }
      } catch (error) {
        console.error('Error fetching slots:', error)
        toast.error('Failed to load available slots')
      } finally {
        setLoadingSlots(false)
      }
    }

    fetchSlots()
  }, [])

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

  // Get available dates from slots (dates that have at least one available time)
  const availableDates = useMemo(() => {
    const dates = new Set<string>()
    availableSlots.forEach(slot => {
      dates.add(slot.date)
    })
    return dates
  }, [availableSlots])

  // Get available time slots for the selected date
  const timeSlots = useMemo(() => {
    if (!selectedDate) return []
    
    const selectedDateStr = new Date(currentYear, currentMonth, selectedDate)
      .toISOString()
      .split('T')[0] // Format: YYYY-MM-DD
    
    const slots = availableSlots
      .filter(slot => slot.date === selectedDateStr)
      .map(slot => ({
        time: slot.time,
        available: true,
        _id: slot._id
      }))
      .sort((a, b) => a.time.localeCompare(b.time))
    
    return slots
  }, [selectedDate, availableSlots, currentMonth, currentYear])

  // Check if a date has available slots
  const isDateAvailable = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return false
    
    const dateStr = new Date(currentYear, currentMonth, day)
      .toISOString()
      .split('T')[0]
    
    return availableDates.has(dateStr)
  }

  // Convert 24-hour time to 12-hour format
  const formatTime12Hour = (time24: string) => {
    if (!time24) return ''
    
    const [hours, minutes] = time24.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    
    return `${hour12}:${minutes} ${ampm}`
  }

  const handleDateClick = (day: number | null, isCurrentMonth: boolean) => {
    if (day !== null && isCurrentMonth) {
      const today = new Date()
      const selectedDateObj = new Date(currentYear, currentMonth, day)
      const todayDateObj = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      
      // Only allow selection of today or future dates AND dates with available slots
      if (selectedDateObj >= todayDateObj && isDateAvailable(day, isCurrentMonth)) {
        setSelectedDate(day)
        // Reset selected time when date changes
        setSelectedTime(null)
      }
    }
  }

  const handleTimeClick = (time: string, available: boolean) => {
    if (available) {
      setSelectedTime(time)
      
      // Smooth scroll to form with animation after a short delay
      setTimeout(() => {
        formRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        })
      }, 300)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate calendar selection (REQUIRED)
    console.log('Form submit - selectedDate:', selectedDate, 'selectedTime:', selectedTime)
    
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time before submitting')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Format the selected date
      const selectedDateObj = new Date(currentYear, currentMonth, selectedDate)
      const formattedDate = selectedDateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      // Prepare private appointment data
      const privateData = {
        selectedDate: formattedDate,
        selectedTime
      }
      
      // Prepare enquiry data (using placeholder values for required API fields)
      const enquiryData = {
        fullName: 'Private Appointment',
        email: 'private@example.com',
        phone: 'N/A',
        address: 'N/A',
        dateOfBirth: 'N/A',
        services: `Private Session - ${formattedDate} at ${selectedTime}`,
        sessionType: 'private',
        comment: JSON.stringify(privateData)
      }
      
      console.log('Submitting enquiry:', enquiryData)
      
      // Submit to API
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enquiryData),
      })
      
      const data = await response.json()
      console.log('API response:', data)
      
      if (data.success) {
        toast.success('Private appointment submitted successfully! We will contact you soon.')
        // Reset form
        setSelectedDate(null)
        setSelectedTime(null)
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        toast.error(data.message || 'Failed to submit appointment. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to submit appointment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className='bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen'>
      <Navbar />
      <div className="w-full">
        <section className="w-full px-4 md:px-0 py-[68px]">
          <div className="max-w-6xl pb-[106px] mx-auto">
            {/* Header */}
            <div className="mb-8 md:mb-12">
              <h1 className="text-[32px] sm:text-[36px] md:text-[40px]  text-[#D5B584] font-light leading-tight mb-3">
                Schedule Your Private Session
              </h1>
              <p className="text-[16px] sm:text-[18px] md:text-[20px] text-[#5B7C99] font-light">
                Check Out Our Availability And Book The Date And Time That Works For You
              </p>
            </div>

            {/* Combined Form */}
            <form onSubmit={handleFormSubmit}>
              {/* Calendar and Time Selection Container */}
              <div className="rounded-[24px] p-6 md:p-8 lg:p-10 border">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Left side - Calendar */}
                <div className="w-full lg:w-1/2">
                  <h3 className="text-[18px] sm:text-[20px] md:text-[22px] text-[#5B7C99] font-normal mb-6">
                    Select Date & Time
                  </h3>

                  <div className=" border-2 border-[#E5E7EB] rounded-[16px] p-4">
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
                      {loadingSlots ? (
                        <div className="flex items-center justify-center py-8">
                          <p className="text-[#6B7280] text-sm">Loading available dates...</p>
                        </div>
                      ) : (
                        calendarDays.map((week, weekIndex) => (
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
                              
                              // Check if date has available slots
                              const hasSlots = isCurrentMonth && isDateAvailable(day, isCurrentMonth)
                              const isSelected = selectedDate === day && isCurrentMonth
                              const isDisabled = !isCurrentMonth || isPastDate || !hasSlots

                              return (
                                <button
                                  type="button"
                                  key={dayIndex}
                                  onClick={() => handleDateClick(day, isCurrentMonth)}
                                  disabled={isDisabled}
                                  className={`
                                    aspect-square rounded-lg text-[14px] sm:text-[16px] font-medium
                                    transition-all duration-200
                                    ${
                                      isSelected
                                        ? 'bg-[#EF4444] text-white'
                                        : isCurrentMonth && !isPastDate && hasSlots
                                        ? 'bg-[#1E3A8A] text-white hover:bg-[#1E40AF]'
                                        : 'bg-[#374151] text-[#9CA3AF] cursor-not-allowed opacity-50'
                                    }
                                  `}
                                  title={
                                    !isCurrentMonth ? 'Not in current month' :
                                    isPastDate ? 'Past date' :
                                    !hasSlots ? 'No available slots' :
                                    'Click to select'
                                  }
                                >
                                  {day}
                                </button>
                              )
                            })}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side - Time Slots */}
                <div className="w-full lg:w-1/2">
                  <h3 className="text-[18px] sm:text-[20px] md:text-[22px] text-[#5B7C99] font-normal mb-6">
                    Time Zone: Singapore Standard Time (SMT +8)
                  </h3>

                  {/* Time Slots Grid */}
                  {!selectedDate ? (
                    <div className="flex items-center justify-center py-12 px-4 bg-zinc-100 rounded-lg">
                      <p className="text-[#6B7280] text-center">
                        Please select a date first to see available time slots
                      </p>
                    </div>
                  ) : timeSlots.length === 0 ? (
                    <div className="flex items-center justify-center py-12 px-4 bg-zinc-100 rounded-lg">
                      <p className="text-[#6B7280] text-center">
                        No available time slots for this date
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                      {timeSlots.map((slot, index) => {
                        const isSelected = selectedTime === slot.time
                        
                        return (
                          <button
                            type="button"
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
                            {formatTime12Hour(slot.time)}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

          
         
              </div>
              </div>


            </form>
          </div>
          <div className='max-w-6xl mx-auto'>
            <div className=''>
              <div className='rounded-[24px] p-6 md:p-8 lg:p-10 border shadow-lg bg-white/50'>
              
              {/* Payment Section */}
              {selectedDate && selectedTime && (
                <div className="">
                  <div className=" bg-red-200">
                    <h2 className="text-[28px] sm:text-[32px] md:text-[36px] text-[#D5B584] font-light mb-8">
                      Make Your Payment
                    </h2>

                    {/* Google Pay Button */}
                    <button
                      type="button"
                      className=" bg-[#D5B584] hover:bg-[#C4A574] text-white rounded-[12px] px-6 py-4 flex items-center justify-center gap-3 text-[16px] sm:text-[18px] font-medium transition-colors duration-300 mb-4"
                    >
                      <span>Pay with</span>
                      <svg width="48" height="20" viewBox="0 0 48 20" fill="none">
                        <rect width="48" height="20" rx="4" fill="white"/>
                        <path d="M20.5 6.5h2.5v7h-2.5v-7zm6.5 4.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5-1 2.5-2.5 2.5-2.5-1-2.5-2.5zm-1.5 0c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5-2-4.5-4.5-4.5-4.5 2-4.5 4.5z" fill="#4285F4"/>
                        <path d="M35.5 6.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5c1.5 0 2.8-.7 3.5-1.8l-2-1.2c-.3.6-1 1-1.5 1-1 0-1.8-.7-2-1.5h5.5c0-.3.1-.7.1-1 0-2.5-2-4.5-4.6-4.5z" fill="#EA4335"/>
                      </svg>
                      <span className="text-[#6B7280]">or</span>
                    </button>

                    {/* More Payment Options */}
                    <button
                      type="button"
                      onClick={() => setShowMorePayments(!showMorePayments)}
                      className="text-[#5B7C99] text-[14px] sm:text-[16px] font-normal flex items-center gap-2 hover:text-[#4A6B88] transition-colors"
                    >
                      More Payment Options
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${showMorePayments ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Additional Payment Options */}
                    {showMorePayments && (
                      <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
                        <button
                          type="button"
                          className=" bg-white border-2 border-gray-300 hover:border-[#D5B584] text-gray-800 rounded-[12px] px-6 py-4 flex items-center justify-center gap-3 text-[16px] font-medium transition-all duration-300"
                        >
                          <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                            <rect width="40" height="24" rx="4" fill="#0079C1"/>
                            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">PayPal</text>
                          </svg>
                          Pay with PayPal
                        </button>

                        <button
                          type="button"
                          className="w-full bg-white border-2 border-gray-300 hover:border-[#D5B584] text-gray-800 rounded-[12px] px-6 py-4 flex items-center justify-center gap-3 text-[16px] font-medium transition-all duration-300"
                        >
                          <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                            <rect width="40" height="24" rx="4" fill="#635BFF"/>
                            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">Stripe</text>
                          </svg>
                          Pay with Credit/Debit Card
                        </button>

                        <button
                          type="button"
                          className=" bg-white border-2 border-gray-300 hover:border-[#D5B584] text-gray-800 rounded-[12px] px-6 py-4 flex items-center justify-center gap-3 text-[16px] font-medium transition-all duration-300"
                        >
                          <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                            <rect width="40" height="24" rx="4" fill="#00BAC7"/>
                            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Bank</text>
                          </svg>
                          Bank Transfer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>


        </section>
      </div>
      <Footer />
    </div>
  )
}

export default PrivateAppointmentPage

