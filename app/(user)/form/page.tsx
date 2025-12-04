'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'

const FormPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    dateOfBirth: '',
    services: '',
    phone: '',
    email: '',
    comment: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Determine sessionType based on service selection
    let sessionType = 'discovery'
    if (formData.services === 'discovery') {
      sessionType = 'discovery'
    } else if (formData.services === 'group-session') {
      sessionType = 'corporate'
    } else if (['sound-healing', 'meditation', 'yoga', 'crystal-therapy'].includes(formData.services)) {
      sessionType = 'private'
    }
    
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, sessionType }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Thank you for submitting! We will contact you soon.')
        // Reset form
        setFormData({
          fullName: '',
          address: '',
          dateOfBirth: '',
          services: '',
          phone: '',
          email: '',
          comment: ''
        })
      } else {
        toast.error(data.message || 'Failed to submit enquiry. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to submit enquiry. Please try again.')
    }
  }

  return (
    <div className=' bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen'>
      <Navbar />
      <div className="w-full ">
        <section className="w-full px-4 md:px-0 py-[68px]">
          <div className="max-w-6xl pb-[106px] mx-auto">
            {/* Header */}
            <div className="mb-8 md:mb-12">
              <h1 className="text-[32px] sm:text-[36px] md:text-[40px]  text-[#D5B584] font-light leading-tight mb-3">
                Book Now
              </h1>
              <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#5B7C99] font-light leading-relaxed max-w-2xl">
                Lorem ipsum dolor sit amet consectetur. Eu proin donec est ac velit massa et lobortis.
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-transparent">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Row - Full Name & Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-[#E8E4E1] rounded-lg text-[#5B7C99] placeholder-[#5B7C99] text-[14px] sm:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#D5B584] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-[#E8E4E1] rounded-lg text-[#5B7C99] placeholder-[#5B7C99] text-[14px] sm:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#D5B584] transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Second Row - Date of Birth & Services */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="relative">
                    <select
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-[#E8E4E1] rounded-lg text-[#5B7C99] text-[14px] sm:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#D5B584] transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Date of Birth</option>
                      <option value="1990">1990</option>
                      <option value="1991">1991</option>
                      <option value="1992">1992</option>
                      <option value="1993">1993</option>
                      <option value="1994">1994</option>
                      <option value="1995">1995</option>
                      <option value="1996">1996</option>
                      <option value="1997">1997</option>
                      <option value="1998">1998</option>
                      <option value="1999">1999</option>
                      <option value="2000">2000</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6L8 10L12 6" stroke="#5B7C99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      name="services"
                      value={formData.services}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-[#E8E4E1] rounded-lg text-[#5B7C99] text-[14px] sm:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#D5B584] transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Services</option>
                      <option value="discovery">Discovery Session</option>
                      <option value="sound-healing">Private - Sound Healing</option>
                      <option value="meditation">Private - Meditation</option>
                      <option value="yoga">Private - Yoga</option>
                      <option value="crystal-therapy">Private - Crystal Therapy</option>
                      <option value="group-session">Corporate - Group Session</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6L8 10L12 6" stroke="#5B7C99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Third Row - Phone & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-[#E8E4E1] rounded-lg text-[#5B7C99] placeholder-[#5B7C99] text-[14px] sm:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#D5B584] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-[#E8E4E1] rounded-lg text-[#5B7C99] placeholder-[#5B7C99] text-[14px] sm:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#D5B584] transition-all"
                      required
                    />
                  </div>
                </div>

             

                {/* Comment Section */}
                <div className="pt-8">
                  <textarea
                    name="comment"
                    placeholder="Write your comment here"
                    value={formData.comment}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-6 py-4 bg-white/20 border-2 border-[#5B7C99] rounded-lg text-[#5B7C99] placeholder-[#5B7C99] text-[14px] sm:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#D5B584] transition-all resize-none"
                  />
                </div>

                {/* Second Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#1C3163] text-white px-12 py-4 rounded-lg text-[16px] sm:text-[18px] font-medium hover:bg-[#2a4580] transition-colors duration-300 shadow-md"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default FormPage

