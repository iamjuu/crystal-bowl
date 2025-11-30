import React from 'react'
import Image from 'next/image'
import { About1, About2 } from '@/public/assets'

const ServicesPage = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
      <section className="w-full px-4 md:px-0 py-[68px]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col w-full">
            {/* Section Title */}
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] pb-4 sm:pb-5 md:pb-6 text-[#D5B584] font-normal">
              Services
            </h2>

            {/* Content Container */}
            <div className="flex flex-col lg:flex-row w-full gap-8 md:gap-10 lg:gap-12">
              {/* Left side - Text Content */}
              <div className="w-full lg:w-[65%] xl:w-[70%]">
                <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[16px] font-light text-[#6B5D4F] leading-relaxed sm:leading-relaxed md:leading-loose">
                  <p>
                    Sound healing is a transformative practice that uses vibrational frequencies to restore balance and promote deep healing in the body, mind, and spirit. Through the resonant tones of Crystal Singing Bowls, Gongs, Ting Shas and Harmonium, sound healing works by creating specific frequencies that interact with the body's energetic field, helping to release blockages, calm the nervous system, and restore harmony.
                  </p>

                  <p>
                    Scientifically, sound healing is grounded in the concept of vibrational medicine, where sound waves are recognized for their ability to influence physical and mental states. Research has shown that different frequencies can stimulate the body's cells and nervous system, inducing relaxation and promoting healing. For example, sound frequencies can reduce stress hormones, lower blood pressure, and activate theta waves, increase brainwave activity associated with deep relaxation and meditative states, such as alpha and theta waves. Studies have also suggested that sound healing may help improve sleep, enhance cognitive function, and promote overall well-being.
                  </p>

                  <p>
                    Whether through a guided sound bath, meditation or private session, sound healing offers a powerful way to reconnect with your inner self, reduce stress, and achieve mental, emotional and physical balance. It's a holistic therapy that
                  </p>
                </div>
              </div>

              {/* Right side - Abstract Graphics */}
              <div className="relative w-full lg:w-[35%] xl:w-[30%] flex flex-row sm:flex-row lg:flex-col justify-center sm:justify-evenly lg:justify-between items-center lg:items-end gap-6 sm:gap-8 lg:gap-6 xl:gap-8 mt-4 lg:mt-0">
                <div className="lg:max-w-none">
                  <Image
                    src={About1}
                    alt="decorative icon"
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="lg:max-w-none">
                  <Image
                    src={About2}
                    alt="decorative icon"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServicesPage

