'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'
import { BookNow } from '@/public/assets'

const PrivateAppointmentPage = () => {
  return (
    <div className='bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen'>
      <Navbar />
      <div className="w-full">
        <section className="w-full px-4 md:px-0 py-[68px]">
          <div className="max-w-6xl pb-[106px] border-b mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Left side - Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-[20px] overflow-hidden bg-gray-200 shadow-lg">
                  <Image
                    src={BookNow}
                    alt="Private Appointment"
                    width={600}
                    height={700}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Right side - Content */}
              <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <h1 className="text-[32px] sm:text-[36px] md:text-[40px] text-[#D5B584] font-light leading-tight">
                  Private Appointment
                </h1>

                <div className="flex flex-col gap-4 text-[14px] sm:text-[15px] md:text-[16px] text-[#6B5D4F] font-light leading-relaxed">
                  <p>
                    Experience the full transformative power of personalized sound healing in a one-on-one private session. These appointments are tailored specifically to your unique needs, goals, and wellness journey.
                  </p>
                  <p>
                    In a private appointment, you&apos;ll receive undivided attention and a customized healing experience using Crystal Singing Bowls, Gongs, Ting Shas, and Harmonium. Each session is designed to address your specific concerns, whether you&apos;re seeking stress relief, emotional healing, physical wellness, or spiritual growth.
                  </p>
                  <p>
                    These intimate sessions provide a safe, nurturing space for deep healing and transformation. You&apos;ll have the opportunity to work closely with the practitioner to explore and release blockages, restore balance, and achieve profound states of relaxation and inner peace.
                  </p>
                </div>

                <div className="mt-4">
                  <Link href="/calendar?type=private">
                    <button className="bg-[#D5B584] text-white px-8 py-4 rounded-lg text-[16px] sm:text-[18px] font-normal hover:bg-[#C4A573] transition-colors duration-300 shadow-md">
                      Book Private Session
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Session Details Section */}
          <div className="max-w-6xl mx-auto mt-16 md:mt-20 px-4 md:px-0">
            <h2 className="text-[28px] sm:text-[32px] md:text-[36px] text-[#D5B584] font-light mb-8">
              Session Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-[20px] shadow-sm">
                <h3 className="text-[20px] text-[#D5B584] font-normal mb-3">
                  Duration
                </h3>
                <p className="text-[14px] sm:text-[15px] text-[#6B5D4F] font-light">
                  60-90 minutes of personalized sound healing therapy, including consultation and integration time.
                </p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-[20px] shadow-sm">
                <h3 className="text-[20px] text-[#D5B584] font-normal mb-3">
                  Format
                </h3>
                <p className="text-[14px] sm:text-[15px] text-[#6B5D4F] font-light">
                  Available in-person at our healing studio or online via video call for remote sessions.
                </p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-[20px] shadow-sm">
                <h3 className="text-[20px] text-[#D5B584] font-normal mb-3">
                  Customization
                </h3>
                <p className="text-[14px] sm:text-[15px] text-[#6B5D4F] font-light">
                  Each session is uniquely designed based on your intentions, needs, and current state of being.
                </p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-[20px] shadow-sm">
                <h3 className="text-[20px] text-[#D5B584] font-normal mb-3">
                  What&apos;s Included
                </h3>
                <p className="text-[14px] sm:text-[15px] text-[#6B5D4F] font-light">
                  Pre-session consultation, personalized sound healing, guided meditation, and post-session integration support.
                </p>
              </div>
            </div>

            {/* Benefits Section */}
            <h2 className="text-[28px] sm:text-[32px] md:text-[36px] text-[#D5B584] font-light mb-8">
              Benefits of Private Sessions
            </h2>
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[20px] shadow-sm">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-[#D5B584] text-[20px] mt-1">•</span>
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#6B5D4F] font-light">
                    <strong className="font-normal">Personalized Attention:</strong> Receive one-on-one care tailored to your specific needs and goals
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D5B584] text-[20px] mt-1">•</span>
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#6B5D4F] font-light">
                    <strong className="font-normal">Deep Healing:</strong> Experience profound transformation in a safe, supportive environment
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D5B584] text-[20px] mt-1">•</span>
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#6B5D4F] font-light">
                    <strong className="font-normal">Flexible Scheduling:</strong> Choose times that work best for your schedule and lifestyle
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D5B584] text-[20px] mt-1">•</span>
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#6B5D4F] font-light">
                    <strong className="font-normal">Targeted Healing:</strong> Address specific physical, emotional, or spiritual concerns with precision
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D5B584] text-[20px] mt-1">•</span>
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#6B5D4F] font-light">
                    <strong className="font-normal">Privacy & Comfort:</strong> Enjoy a confidential, intimate setting for your healing journey
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D5B584] text-[20px] mt-1">•</span>
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#6B5D4F] font-light">
                    <strong className="font-normal">Ongoing Support:</strong> Build a relationship with your practitioner for continued growth and healing
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default PrivateAppointmentPage

