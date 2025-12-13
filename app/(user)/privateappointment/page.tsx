'use client'

import React, { useMemo, useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'
import ProtectedRoute from '@/components/user/ProtectedRoute'
import { useRouter } from 'next/navigation'

type AvailableSlot = {
  _id: string
  sessionType: string
  month: string
  date: string
  time: string
  isBooked: boolean
  price?: number // Price for private sessions
}

const PrivateAppointmentPage = () => {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  
  // Ref for scrolling to form
  const formRef = useRef<HTMLDivElement>(null)
  
  // Available slots state
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(true)
  
  // Payment state
  const [isLoading, setIsLoading] = useState(false)
  const [bookingAmount, setBookingAmount] = useState<number | null>(null) // Will be set from selected slot

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
      .filter(slot => slot.date === selectedDateStr && !slot.isBooked)
      .map(slot => ({
        time: slot.time,
        available: true,
        _id: slot._id,
        price: slot.price || 0 // Include price in time slots
      }))
      .sort((a, b) => a.time.localeCompare(b.time))
    
    return slots
  }, [selectedDate, availableSlots, currentMonth, currentYear])

  // Get selected slot ID
  const selectedSlotId = useMemo(() => {
    if (!selectedTime) return null
    const slot = timeSlots.find(s => s.time === selectedTime)
    return slot?._id || null
  }, [selectedTime, timeSlots])

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

  const handleTimeClick = (time: string, available: boolean, price?: number) => {
    if (available) {
      setSelectedTime(time)
      // Set the booking amount from the selected slot's price
      if (price !== undefined && price > 0) {
        setBookingAmount(price)
      } else {
        setBookingAmount(null)
      }
      
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

  const handleCheckout = async () => {
    // Check if date and time are selected
    if (!selectedDate || !selectedTime || !selectedSlotId) {
      toast.error('Please select both date and time')
      return
    }

    // Check if booking amount is available
    if (!bookingAmount || bookingAmount <= 0) {
      toast.error('Invalid session price. Please select a different session.')
      return
    }

    // Check if user is logged in
    const token = localStorage.getItem("userToken")
    if (!token) {
      toast.error("Please login to book a session")
      router.push("/login")
      return
    }

    setIsLoading(true)

    try {
      // Format the selected date
      const selectedDateObj = new Date(currentYear, currentMonth, selectedDate)
      const formattedDate = selectedDateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      // Convert price to cents for Stripe (if price is in dollars, multiply by 100)
      // Assuming price is stored in dollars in database, convert to cents
      const amountInCents = Math.round(bookingAmount * 100)

      // Create Stripe checkout session
      const response = await fetch("/api/payment/create-private-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slotId: selectedSlotId,
          amount: amountInCents,
          date: formattedDate,
          time: selectedTime,
        }),
      })

      const data = await response.json()

      if (data.success && data.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.data.url
      } else {
        toast.error(data.message || "Failed to create checkout session")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }
  return (
    <ProtectedRoute>
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

            {/* Calendar and Payment Section */}
            <div>
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
                            onClick={() => handleTimeClick(slot.time, slot.available, slot.price)}
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


            </div>
          </div>
          <div className='max-w-6xl mx-auto'>
            <div className=''>
              <div className='rounded-[24px] p-6 md:p-8 lg:p-10 border shadow-lg bg-white/50'>
              
                {/* Payment Section */}
                {selectedDate && selectedTime && bookingAmount !== null && bookingAmount > 0 && (
                  <div className="">
                    <div className="bg-white/80 p-6 md:p-8 rounded-[20px]">
                      <h2 className="text-[28px] sm:text-[32px] md:text-[36px] text-[#D5B584] font-light mb-4">
                        Make Your Payment
                      </h2>
                      
                      <p className="text-[16px] text-gray-700 mb-6">
                        Session Amount: <span className="text-[#D5B584] font-semibold text-[20px]">${bookingAmount.toFixed(2)}</span>
                      </p>

                      {/* Stripe Checkout Button */}
                      <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={isLoading || !bookingAmount || bookingAmount <= 0}
                        className="w-full bg-[#635BFF] hover:bg-[#5347E6] text-white rounded-[12px] px-6 py-4 flex items-center justify-center gap-3 text-[18px] font-medium transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                              <rect width="20" height="24" fill="white" rx="2"/>
                              <text x="10" y="16" textAnchor="middle" fill="#635BFF" fontSize="10" fontWeight="bold">S</text>
                            </svg>
                            Proceed to Payment
                          </>
                        )}
                      </button>
                      
                      <p className="text-center text-sm text-gray-600 mt-4">
                        🔒 Secure payment powered by Stripe
                      </p>
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
    </ProtectedRoute>
  )
}

export default PrivateAppointmentPage

