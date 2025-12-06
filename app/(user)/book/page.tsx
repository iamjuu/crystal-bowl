'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'
import { About1, BookNow } from '@/public/assets'

const BookPage = () => {
  return (
    <div className=' bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen'>
      <Navbar />
      <div className="w-full ">
        <section className="w-full px-4 md:px-0 py-[68px]">
          <div className="max-w-6xl pb-[106px] border-b mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Left side - Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-[20px] overflow-hidden bg-gray-200 shadow-lg">
                  <Image
                    src={BookNow}
                    alt="Book a Session"
                    width={600}
                    height={700}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Right side - Content */}
              <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <h1 className="text-[32px] sm:text-[36px] md:text-[40px] text-[#5B7C99] font-light leading-tight">
                  Lorem ipsum dolor sit amet consectetur. dolor sit amet
                </h1>

                <div className="flex flex-col gap-4 text-[14px] sm:text-[15px] md:text-[16px] text-[#5B7C99] font-light leading-relaxed">
                  <p>
                    Lorem ipsum dolor sit amet consectetur. Nulla cras lacus enim gravida lectus duis tempus. Sed eget elementum amet sem nulla commodo amet non donec.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur. Nulla cras lacus enim gravida lectus duis tempus. Sed eget elementum amet sem nulla commodo amet non donec.
                  </p>
                </div>

                <div className="mt-4">
                  <Link href="/discoveryappointment">
                    <button className="bg-[#1C3163] text-white px-8 py-4 rounded-lg text-[16px] sm:text-[18px] font-normal hover:bg-[#2a4580] transition-colors duration-300">
                      Book a Session
                    </button>
                  </Link>
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

export default BookPage
