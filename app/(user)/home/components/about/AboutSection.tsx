import React from "react";
import Image from "next/image";
import {
  AboutNew1,
  AboutNew2,
  AboutSection,
  AboutSection1,
  ServiceImage1,
  ServiceImage2,
  ServiceImage3
} from "@/public/assets";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const AboutSectionComponent = () => {
  return (
    <section className="w-full  px-4 md:px-0 py-[68px]">
      <div className="max-w-6xl mx-auto">
        <div className="flex   flex-col w-full">
          {/* Section Title */}
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] pb-4 sm:pb-5 md:pb-6 text-[#D5B584] font-normal">
            Founder's Note
          </h2>

          {/* Content Container */}
          <div className="flex  flex-col lg:flex-row w-full gap-8 md:gap-10 lg:gap-12">
            {/* Left side - Text Content */}
            <div className="w-full lg:w-[65%] xl:w-[60%]">
              <div
               className="flex flex-col gap-4 sm:gap-5 md:gap-6 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[16px] font-light text-[#6B5D4F] leading-relaxed sm:leading-relaxed md:leading-loose"
               >
                {/* Original About Content - Commented Out */}
                {/* <p>
                  Crystal Bowl Studio is created and designed by master sound
                  and energy healer Francesca Wong, fulfilling her dream to
                  create a range of crystal bowls that are beautifully designed,
                  with premium crystal quality and sound, with a powerful
                  resonance and energy, at a more affordable price to make sound
                  healing more accessible to healers all over the world.
                </p>

                <p>
                  Our Crystal Bowls are 100% clear quartz crystal, with some of
                  our premium designs infused with other crystals, metals and
                  earth elements. They are lightweight and come in the most
                  magical designs and colors to really make your practice
                  unique. Take them with you on your Travels!
                </p>

                <p>
                  Each bowl carries its own unique energy and intention so you
                  can choose yours to match your own unique intentions, energy
                  and aesthetic as a healer.
                </p> */}

                <p>
                  Crystal Bowl Studio was founded by Francesca Wong, a former
                  corporate executive with experience at KPMG, Citibank, Alibaba,
                  and Estée Lauder. After over a decade in global finance,
                  ecommerce, and luxury beauty, she journeyed from boardrooms to a
                  vision: "To create a range of crystal singing bowls that honour
                  beauty, premium crystal quality and sound, with powerful
                  resonance, at a more affordable price." Her mission is to make the
                  power of Sound Healing accessible to healers and practitioners all
                  over the world, anywhere anytime. Crystal Bowl Studio was born
                  from the belief that healing tools should be well-crafted,
                  intentional, and accessible. Objects that support presence,
                  ritual, and connection in everyday life. Each bowl is designed not
                  only to aesthetically sound exquisite, but to feel purposeful in
                  the hands of the person using it. This work is an offering to
                  practitioners, teachers, and seekers around the world, who wish to
                  experience and share the power of sound healing with ease,
                  simplicity, beauty, and integrity.
                </p>
                <p className="text-[#6B5D4F]">
                  May these bowls be a bridge to your highest self. - Francesca
                </p>
              </div>
            </div>

            {/* Right side - Abstract Graphics */}
            <div className="relative w-full lg:w-[35%] xl:w-[40%] flex flex-row sm:flex-row  gap-2 ">
              <div className=" lg:max-w-none">
                <Image
                  src={AboutNew1}
                  alt="about"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className=" lg:max-w-none">
                <Image
                  src={AboutNew2}
                  alt="about"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
          <div className="">
            {/* Read More Link */}
            <div className="flex pt-6 sm:pt-7 md:pt-8 lg:pt-9 items-center">
              {/* <Link
                href="/about"
                className="inline-flex text-[#D5B584] items-center gap-2 text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-medium hover:opacity-80 transition-opacity"
              >
                Read More
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#D5B584]" />
              </Link> */}
            </div>
          </div>
        </div>
        {/* Original Founder's Note - Commented Out (duplicate) */}
        {/* <div>
          <div>
            <h1  className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[22px] pb-4 sm:pb-5 md:pb-6 text-black font-normal">Founder's Note</h1>
            <p  
                           className="flex flex-col gap-4 sm:gap-5 md:gap-6 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[16px] font-light text-[#6B5D4F] leading-relaxed sm:leading-relaxed md:leading-loose"

            >
              Crystal Bowl Studio was founded by Francesca Wong, a former
              corporate executive with experience at KPMG, Citibank, Alibaba,
              and Estée Lauder. After over a decade in global finance,
              ecommerce, and luxury beauty, she journeyed from boardrooms to a
              vision: "To create a range of crystal singing bowls that honour
              beauty, premium crystal quality and sound, with powerful
              resonance, at a more affordable price." Her mission is to make the
              power of Sound Healing accessible to healers and practitioners all
              over the world, anywhere anytime. Crystal Bowl Studio was born
              from the belief that healing tools should be well-crafted,
              intentional, and accessible. Objects that support presence,
              ritual, and connection in everyday life. Each bowl is designed not
              only to aesthetically sound exquisite, but to feel purposeful in
              the hands of the person using it. This work is an offering to
              practitioners, teachers, and seekers around the world, who wish to
              experience and share the power of sound healing with ease,
              simplicity, beauty, and integrity.{" "}
            </p>
            <p className="text-[#6B5D4F]">
              May these bowls be a bridge to your highest self. - Francesca{" "}
            </p>
          </div>
          <div className="mt-10">
          
          </div>
        </div> */}
        <div className="mt-10">
          <div>
            <h1  className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[22px] pb-4 sm:pb-5 md:pb-6 text-black font-normal">About Crystal Bowl Studio</h1>
            <p 
               className="flex flex-col gap-4 sm:gap-5 md:gap-6 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[16px] font-light text-[#6B5D4F] leading-relaxed sm:leading-relaxed md:leading-loose"
               >
              Crystal Bowl Studio is designed for modern, conscious living,
              rooted in ancient traditions and wisdom. Each bowl is made from
              100% clear quartz crystal, carefully handcrafted and
              quality-checked, to produce clarity, rich, ethereal vibration that
              supports meditation, relaxation and healing work. Our bowls are
              lightweight, travel-friendly, and designed in the most elegant and
              luminous colours to make your practice available and accessible,
              anywhere and anytime. Take them with you on your travels! No two
              bowls are ever the same. Each carries its own unique energy and
              intention, so you can choose one that matches your unique energy,
              intention, purpose, and aesthetic as a healer or practitioner.
              Crystal Bowl Studio positions at the intersection of premium
              craftsmanship, wellness, accessibility and scalable global impact
              - offering sound healing tools that are as beautiful to behold as
              they are powerful to experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionComponent;
