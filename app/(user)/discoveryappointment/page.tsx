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

const DiscoveryAppointmentPage = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  
  // Ref for scrolling to form
  const formRef = useRef<HTMLDivElement>(null)
  
  // Available slots state
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(true)
  
  // Bowl Discovery Form state
  const [hasCrystalBowls, setHasCrystalBowls] = useState<string | null>(null)
  const [notesAndAlchemies, setNotesAndAlchemies] = useState<string>('')
  const [experienceLevel, setExperienceLevel] = useState<string[]>([])
  const [mainIntention, setMainIntention] = useState<string[]>([])
  const [soundOrEnergy, setSoundOrEnergy] = useState<string>('')
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch available slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoadingSlots(true)
        const response = await fetch('/api/slots?sessionType=discovery')
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

  const handleExperienceLevelChange = (value: string) => {
    setExperienceLevel(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    )
  }

  const handleMainIntentionChange = (value: string) => {
    setMainIntention(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    )
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate calendar selection (REQUIRED)
    console.log('Form submit - selectedDate:', selectedDate, 'selectedTime:', selectedTime)
    
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time before submitting')
      return
    }
    
    // Bowl Discovery Form fields are now OPTIONAL
    // Users can submit with just date/time selection
    
    setIsSubmitting(true)
    
    try {
      // Format the selected date
      const selectedDateObj = new Date(currentYear, currentMonth, selectedDate)
      const formattedDate = selectedDateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      // Prepare discovery form data (only include if provided)
      const discoveryData = {
        selectedDate: formattedDate,
        selectedTime,
        hasCrystalBowls: hasCrystalBowls || 'Not specified',
        notesAndAlchemies: notesAndAlchemies || 'Not provided',
        experienceLevel: experienceLevel.length > 0 ? experienceLevel : ['Not specified'],
        mainIntention: mainIntention.length > 0 ? mainIntention : ['Not specified'],
        soundOrEnergy: soundOrEnergy || 'Not provided'
      }
      
      // Prepare enquiry data (using placeholder values for required API fields)
      const enquiryData = {
        fullName: 'Discovery Appointment',
        email: 'discovery@example.com',
        phone: 'N/A',
        address: 'N/A',
        dateOfBirth: 'N/A',
        services: `Discovery Session - ${formattedDate} at ${selectedTime}`,
        sessionType: 'discovery',
        comment: JSON.stringify(discoveryData)
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
        toast.success('Discovery appointment submitted successfully! We will contact you soon.')
        // Reset form
        setSelectedDate(null)
        setSelectedTime(null)
        setHasCrystalBowls(null)
        setNotesAndAlchemies('')
        setExperienceLevel([])
        setMainIntention([])
        setSoundOrEnergy('')
        
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
                Schedule Your Call
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

              {/* Bowl Discovery Form */}
              <div 
                ref={formRef}
                className={`mt-12 transition-all duration-700 ease-out ${
                  selectedTime 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-60 translate-y-4 scale-[0.98]'
                }`}
              >
              <div className="rounded-[24px] p-6 md:p-8 lg:p-10 border  shadow-lg transition-shadow duration-500 hover:shadow-2xl">
                <h2 className="text-[28px] sm:text-[32px] md:text-[36px] text-black font-light mb-4">
                  Bowl Discovery Form <span className="text-[20px] text-gray-600">(Optional)</span>
                </h2>
                <p className="text-[16px] sm:text-[18px] text-black font-light mb-2">
                  Here Are A Few Questions For You To Fill Out So We Can Better Support You In Finding Your Right Bowl Family.
                </p>
                <p className="text-[14px] sm:text-[16px] text-gray-700 font-light mb-8 italic">
                  You can skip this section and submit your appointment with just the date and time selection.
                </p>

                <div className="space-y-8">
                  {/* Question 1: Do You Have Any Crystal Bowls? */}
                  <div>
                    <label className="block text-[16px] sm:text-[18px] text-black font-normal mb-4">
                      Do You Have Any Crystal Bowls? (Or Others)
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="hasCrystalBowls"
                          value="yes"
                          checked={hasCrystalBowls === 'yes'}
                          onChange={(e) => setHasCrystalBowls(e.target.value)}
                          className="w-5 h-5 text-[#D5B584] focus:ring-[#D5B584] focus:ring-2"
                        />
                        <span className="ml-2 text-[16px] text-black">Yes</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="hasCrystalBowls"
                          value="no"
                          checked={hasCrystalBowls === 'no'}
                          onChange={(e) => setHasCrystalBowls(e.target.value)}
                          className="w-5 h-5 text-[#D5B584] focus:ring-[#D5B584] focus:ring-2"
                        />
                        <span className="ml-2 text-[16px] text-black">No</span>
                      </label>
                    </div>
                  </div>

                  {/* Question 2: If Yes - Notes and Alchemies */}
                  {hasCrystalBowls === 'yes' && (
                    <div>
                      <label className="block text-[16px] sm:text-[18px] text-black font-normal mb-4">
                        If Yes: Please List The Notes And Alchemies (If Known):
                      </label>
                      <textarea
                        value={notesAndAlchemies}
                        onChange={(e) => setNotesAndAlchemies(e.target.value)}
                        className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-[16px] text-black focus:outline-none focus:ring-2 focus:ring-[#D5B584] resize-none"
                        rows={3}
                        placeholder="Enter notes and alchemies here..."
                      />
                    </div>
                  )}

                  {/* Question 3: Experience Level */}
                  <div>
                    <label className="block text-[16px] sm:text-[18px] text-black font-normal mb-4">
                      How Would You Describe Your Experience Level? <span className="text-gray-600 text-[14px]">(Optional)</span>
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={experienceLevel.includes('beginner')}
                          onChange={() => handleExperienceLevelChange('beginner')}
                          className="mt-1 w-5 h-5 mr-0 text-[#D5B584] focus:ring-[#D5B584] focus:ring-2 rounded"
                        />
                        <span className="ml-3 text-[16px] text-black">
                          Beginner - I&apos;m New To Crystal Bowls Studio
                        </span>
                      </label>
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={experienceLevel.includes('some-experience')}
                          onChange={() => handleExperienceLevelChange('some-experience')}
                          className="mt-1 w-5 h-5 mr-0 text-[#D5B584] focus:ring-[#D5B584] focus:ring-2 rounded"
                        />
                        <span className="ml-3 text-[16px] text-black">
                          Some Experience - I&apos;ve Played Or Attended Sessions
                        </span>
                      </label>
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={experienceLevel.includes('experienced')}
                          onChange={() => handleExperienceLevelChange('experienced')}
                          className="mt-1 w-5 h-5 mr-0 text-[#D5B584] focus:ring-[#D5B584] focus:ring-2 rounded"
                        />
                        <span className="ml-3 text-[16px] text-black">
                          Experienced - I Own/Play Bowls Regularly
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Question 4: Main Intention */}
                  <div>
                    <label className="block text-[16px] sm:text-[18px] text-black font-normal mb-4">
                      What Is Your Main Intention For Your Your Discovery Session? <span className="text-gray-600 text-[14px]">(Optional)</span>
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mainIntention.includes('specific-note')}
                          onChange={() => handleMainIntentionChange('specific-note')}
                          className="mt-1 w-5 h-5 mr-0 text-[#D5B584] focus:ring-[#D5B584] focus:ring-2 rounded"
                        />
                        <span className="ml-3 text-[16px] text-black">
                          I&apos;m Looking For A Specific Note/Crystal Studio
                        </span>
                      </label>
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mainIntention.includes('complete-set')}
                          onChange={() => handleMainIntentionChange('complete-set')}
                          className="mt-1 w-5 h-5 mr-0 text-[#D5B584] focus:ring-[#D5B584] focus:ring-2 rounded"
                        />
                        <span className="ml-3 text-[16px] text-black">
                          I Want To Complete Or Expand A Set
                        </span>
                      </label>
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mainIntention.includes('ready-purchase')}
                          onChange={() => handleMainIntentionChange('ready-purchase')}
                          className="mt-1 w-5 h-5 mr-0 text-[#D5B584] rounded"
                        />
                        <span className="ml-3 text-[16px] text-black">
                          I Am Ready To Purchase If I Find The Right Bowl
                        </span>
                      </label>
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mainIntention.includes('gathering-inspiration')}
                          onChange={() => handleMainIntentionChange('gathering-inspiration')}
                          className="mt-1 w-5 h-5 mr-0 text-[#D5B584] focus:ring-2 rounded"
                        />
                        <span className="ml-3 text-[16px] text-black">
                          I Am Gathering Inspiration
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Question 5: Sound or Energy */}
                  <div>
                    <label className="block text-[16px] sm:text-[18px] text-black font-normal mb-4">
                      What Kind Of Sound Or Energy Are You Looking For? (E.G. Grounding, Heart-Opening, Masculine/Feminine Balance..) <span className="text-gray-600 text-[14px]">(Optional)</span>
                    </label>
                    <textarea
                      value={soundOrEnergy}
                      onChange={(e) => setSoundOrEnergy(e.target.value)}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-[16px] text-black focus:outline-none focus:ring-2 focus:ring-[#D5B584] resize-none"
                      rows={6}
                      placeholder="Describe the kind of sound or energy you are looking for..."
                    />
                  </div>

                </div>
              </div>
              </div>

              {/* Selected Date & Time Summary */}
              {(selectedDate && selectedTime) && (
                <div className="mt-8 p-6 rounded-[16px] bg-[#D5B584]/10 border-2 border-[#D5B584]">
                  <h3 className="text-[18px] sm:text-[20px] text-[#D5B584] font-medium mb-3">
                    📅 Your Selected Appointment
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <p className="text-[14px] text-[#6B7280] mb-1">Date</p>
                      <p className="text-[16px] sm:text-[18px] text-[#5B7C99] font-medium">
                        {new Date(currentYear, currentMonth, selectedDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] text-[#6B7280] mb-1">Time</p>
                      <p className="text-[16px] sm:text-[18px] text-[#5B7C99] font-medium">
                        {selectedTime} (Singapore Standard Time)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-start pt-4 mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedDate || !selectedTime}
                  className="bg-[#D5B584] text-white px-12 py-4 rounded-lg text-[16px] sm:text-[18px] font-medium hover:bg-[#C4A574] transition-colors duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : !selectedDate || !selectedTime ? 'Select Date & Time First' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default DiscoveryAppointmentPage

