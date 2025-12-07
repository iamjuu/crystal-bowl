'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'

const FormPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
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
    
    // Session type and service are fixed to corporate for this form
    const sessionType = 'corporate'
    const services = 'Corporate Session'
    
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, services, sessionType }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Thank you for submitting! We will contact you soon.')
        // Reset form
        setFormData({
          fullName: '',
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
                {/* First Row - Full Name */}
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

                {/* Second Row - Phone and Email */}
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

