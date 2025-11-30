"use client";
import React, { useState, useRef } from "react";
import Navbar from "@/components/navbar";
import Image from "next/image";
import {
  AboutSection,
  AboutSection1,
  Bucket1,
  Bucket2,
  Bucket3,
  Intention,
  LightWeight,
  TestimonialIcon,
  UniqueToYou,
  Yoga1,
  Yoga2,
  Yoga3,
  YogaSection1,
  YogaSection2,
  YogaSection3
} from "@/public/assets";
import Footer from "@/components/footer";
import { PremiumQuality } from "@/public/assets";
import Link from "next/link";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";

const Data = [
  {
    id: 1,
    image: Bucket1,
    title: "Bucket 1",
    description: "Bucket 1 description",
    price: "₹1000"
  },
  {
    id: 2,
    image: Bucket2,
    title: "Bucket 2",
    description: "Bucket 2 description",
    price: "₹2000"
  },
  {
    id: 3,
    image: Bucket3,
    title: "Bucket 3",
    description: "Bucket 3 description",
    price: "₹3000"
  },
  {
    id: 4,
    image: Bucket2,
    title: "Bucket 2",
    description: "Bucket 2 description",
    price: "₹5000"
  }
];

const Icons = [
  {
    id: 1,
    image: PremiumQuality,
    title: "Premium Quality",
    para: "Our bowls have a powerful sound qualityand resonance. made with 99.9% pureclear quartz and infused with other crystals and precious elements to elevate your practice."
  },

  {
    id: 2,
    image: UniqueToYou,
    title: "Unique To You",
    para: "Every bowl is unique and can be completely customised by chakra design, note and frequency to help you find yourdream crystal bowls."
  },

  {
    id: 3,
    image: LightWeight,
    title: "Light Weight",
    para: "Our bowls are durably made, light - weight and easy to travel with (a sound healers dream) in our protective cases."
  },
  {
    id: 4,
    image: Intention,
    title: "Intention",
    para: "Each bowl is infused with its ownhealing energy and intention, so you can choose you bowls to match your unique energy as a healer"
  }
];

const YogaImage = [
  {
    id: 1,
    image: Yoga1,
    title: "Sound Healing & Yoga",
    description:
      "Personalized sessions for deep healing & alignment"
  },
  {
    id: 2,
    image: Yoga2,
    title: "Corporate Wellness Programs",
    description:
      "Stress management & mindfulness for teams"
  },
  {
    id: 3,
    image: Yoga3,
    title: "Moon Circles & Group Sound Journeys",
    description:
      "Community-based healing experiences"
  }
];

const CreativeJourneyData = [
  {
    id: 1,
    image: YogaSection1,
    title: "Explore the science of sound & its impact on energy",
    description: ""
  },
  {
    id: 2,
    image: YogaSection2,
    title: "Learn to integrate healing frequencies into music production",
    description: ""
  },
  {
    id: 3,
    image: YogaSection3,
    title: "Available for 1:1 coaching or group workshops",
    description: ""
  }
];

const TestimonialsData = [
  {
    id: 1,
    image: Yoga1,
    name: "John Anderson",
    testimonial: "The crystal bowls from this studio have transformed my healing practice. The sound quality is absolutely incredible and my clients can feel the difference immediately."
  },
  {
    id: 2,
    image: Yoga2,
    name: "Sarah Mitchell",
    testimonial: "Frankie's sound healing transported me to another dimension. I felt lighter, freer, and more in tune with myself."
  },
  {
    id: 3,
    image: Yoga3,
    name: "Emma Thompson",
    testimonial: "As a professional sound healer, I've tried many crystal bowls, but these are by far the best. The resonance is powerful and the energy is pure."
  }
];

const UpcomingEventsData = [
  {
    id: 1,
    image: Yoga1,
    date: "07 Monday",
    title: "Full Moon Sound Healing Journey"
  },
  {
    id: 2,
    image: Yoga2,
    date: "10 Thursday",
    title: "Corporate Mindfulness & Stress Release Workshop"
  },
  {
    id: 3,
    image: Yoga3,
    date: "17 Friday",
    title: "1:1 Sound Healing Availability"
  },
  {
    id: 4,
    image: Yoga1,
    date: "07 Monday",
    title: "Full Moon Sound Healing Journey"
  }
];

const Index = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      <div className="relative h-screen w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={(e) => console.error("Video error:", e)}
          onLoadedData={() => console.log("Video loaded successfully")}
        >
          <source src="/assets/images/landing/video/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="relative z-10 h-full flex flex-col justify-between w-full">
          <Navbar />

          <div className="relative">
            <h1 className="text-center pb-[60px] sm:pb-[80px] md:pb-[100px] lg:pb-[120px] px-4 text-[#D5B584] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[50px] italic leading-tight">
              The go-to crystal bowls for <br /> sound healers worldwide.
            </h1>
            
            {/* Mute/Unmute Button */}
            <button
              onClick={toggleMute}
              className="absolute bottom-[20px] sm:bottom-[30px] md:bottom-[40px] lg:bottom-[50px] right-4 sm:right-6 md:right-8 lg:right-12 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-all duration-300 border border-[#D5B584]/30"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-[#D5B584]" />
              ) : (
                <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#D5B584]" />
              )}
            </button>
          </div>
        </div>
      </div>


      <div className="w-full bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2]">
{/* about section  */}
      
      <section className="w-full  px-4 md;px-0 py-[68px]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col w-full">
            {/* Section Title */}
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] pb-4 sm:pb-5 md:pb-6 text-black font-normal">
              About
            </h2>

            {/* Content Container */}
            <div className="flex  flex-col lg:flex-row w-full gap-8 md:gap-10 lg:gap-12">
              {/* Left side - Text Content */}
              <div className="w-full lg:w-[65%] xl:w-[70%]">
                <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[16px] font-light text-black leading-relaxed sm:leading-relaxed md:leading-loose">
                  <p>
                    Crystal Bowl Studio is created and designed by master sound
                    and energy healer Francesca Wong, fulfilling her dream to
                    create a range of crystal bowls that are beautifully
                    designed, with premium crystal quality and sound, with a
                    powerful resonance and energy. at a more affordable price to
                    make sound healing more accessible to healers all over the
                    world.
                  </p>

                  <p>
                    Our Crystal Bowls are 100% clear quartz crystal, with some
                    of our premium designs infused with other crystals, metals
                    and earth elements. They are lightweight and come in the
                    most magical designs and colors to really make your practice
                    unique. Take them with you on your Travels!
                  </p>

                  <p>
                    Each bowl carries its own unique energy and intention so you
                    can choose yours to match your own unique intentions, energy
                    and aesthetic as a healer.
                  </p>
                </div>
              </div>

              {/* Right side - Abstract Graphics */}
              <div className="relative w-full lg:w-[35%] xl:w-[30%] flex flex-row sm:flex-row lg:flex-col justify-center sm:justify-evenly lg:justify-between items-center lg:items-end gap-6 sm:gap-8 lg:gap-6 xl:gap-8 mt-4 lg:mt-0">
                <div className=" lg:max-w-none">
                  <Image
                    src={AboutSection}
                    alt="about"
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className=" lg:max-w-none">
                  <Image
                    src={AboutSection1}
                    alt="about"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="">
              {/* Read More Link */}
              <div className="flex pt-6 sm:pt-7 md:pt-8 lg:pt-9 items-center">
                <a
                  href="#"
                  className="inline-flex text-black items-center gap-2 text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-medium hover:opacity-80 transition-opacity"
                >
                  Read More
                  {/* <Image
                    className="w-4 sm:w-5 h-auto"
                    src={RightArrow}
                    alt="right arrow"
                  /> */}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* collection section  */}

      <section className="w-full py-[40px] md:py-[68px] ">
        <div className="max-w-6xl items-center flex flex-col mx-auto px-4">
          <div className="flex w-full items-center justify-between mb-8 md:mb-0">
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] pb-4 sm:pb-5 md:pb-6 text-black font-normal">
              Collection
            </h2>
            <Link
              href="/collection"
              className="text-black flex gap-2 text-[14px] sm:text-[16px] md:text-[18px]"
            >
              View All
              {/* <Image src={RightArrow} alt="right arrow" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> */}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
            </Link>
          </div>
          <div className="flex flex-col gap-12 md:gap-16 lg:gap-[80px]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-[18px] w-full">
              {Data.map((item) => (
                <div key={item.id} className="text-black">
                  <div className="relative w-full aspect-square">
                    <Image 
                      src={item.image} 
                      alt={item.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="leading-5">
                    <p className="pt-4 sm:pt-6 md:pt-[28px] text-[14px] sm:text-[16px] md:text-[18px]">{item.title}</p>
                    <p className="text-[12px] sm:text-[13px] md:text-[14px]">{item.description}</p>
                    <p className="pt-3 sm:pt-4 md:pt-[18px] text-[10px] sm:text-[11px] md:text-[12px]">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full pt-12 md:pt-16 lg:pt-[80px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-[54px] border-t border-black">
              {Icons.map((item) => (
                <div
                  key={item.id}
                  className="flex text-black flex-col items-center"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 relative">
                    <Image 
                      src={item.image} 
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="leading-5">
                    <p className="pt-4 sm:pt-6 md:pt-[28px] text-center font-[400] text-[14px] sm:text-[16px] md:text-[18px] pb-4 sm:pb-6 md:pb-8">
                      {item.title}
                    </p>
                    <p className="text-center text-[9px] sm:text-[9.5px] md:text-[10px] font-[300] leading-[14px] sm:leading-[15px] md:leading-[16px]">
                      {item.para}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* service section  */}

      <section
        className="w-full py-[40px] md:py-[68px] ">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8 md:mb-12 flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-[62px]">
            <h2 className="text-black text-[28px] sm:text-[32px] md:text-[40px] font-normal">
              Services
            </h2>
            <p className="text-[#1C3163] text-[14px] sm:text-[16px] md:text-[18px] font-light">
              Private Sessions & <br/> Corporate Wellness
            </p>
          </div>

          {/* First Row - Private Sessions & Corporate Wellness */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-12 gap-y-8 md:gap-y-16 mb-12 md:mb-16">
            {YogaImage.map((item) => (
              <div key={item.id} className="flex w-full items-end justify-between">
                {/* Image Container - Left Side */}
                <div className="relative aspect-3/4 w-[50%] rounded-2xl md:rounded-3xl overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content - Right Side */}
                <div className="flex w-[40%] h-full justify-between flex-col">
                  <h3 className="text-[#1C3163] pt-4 sm:pt-6 md:pt-[30px] text-[10px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-normal leading-tight">
                    {item.title}
                  </h3>
                  <div className="flex-col gap-3 sm:gap-4 md:gap-[27px] flex">
                    <p className="text-[#1C3163] text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-light leading-relaxed">
                      {item.description}
                    </p>
                    {/* Arrow Button */}
                    <button className="size-[18px] sm:size-[20px] md:size-[22px] rounded-full border-1 border-[#1C3163] flex items-center justify-center hover:bg-[#1C3163] transition-colors group">
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#1C3163] group-hover:text-white" strokeWidth={.9} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second Section Header */}
          <div className="mb-8 md:mb-12 mt-12 md:mt-20">
            <h2 className="text-[#1C3163] text-[13px] sm:text-[14px] md:text-[16px] font-normal leading-tight">
              Journey to Healing:
              <br />
              Sound & Music for Creatives
            </h2>
          </div>

          {/* Second Row - Creative Journey */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-12 gap-y-8 md:gap-y-16 mb-12 md:mb-16">
            {CreativeJourneyData.map((item) => (
              <div key={item.id} className="flex w-full items-end justify-between">
                {/* Image Container - Left Side */}
                <div className="relative aspect-3/4 w-[50%] rounded-2xl md:rounded-3xl overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content - Right Side */}
                <div className="flex w-[40%] h-full justify-between flex-col">
                  <h3 className="text-[#1C3163] pt-4 sm:pt-6 md:pt-[30px] text-[10px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-normal leading-tight">
                    {item.title}
                  </h3>
                  <div className="flex-col gap-3 sm:gap-4 md:gap-[27px] flex">
                    {/* Arrow Button */}
                    <button className="size-[18px] sm:size-[20px] md:size-[22px] rounded-full border-1 border-[#1C3163] flex items-center justify-center hover:bg-[#1C3163] hover:text-white transition-colors group">
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 group-hover:text-white" strokeWidth={.9} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* testimonials section  */}

      <section className="w-full py-[40px] md:py-[68px]  relative">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-black text-[28px] sm:text-[32px] md:text-[40px] font-normal mb-8 md:mb-12">
            Testimonials
          </h2>
        </div>
        <div 
          style={{
            backgroundImage: `url(${TestimonialIcon.src})`,
            backgroundSize: "contain",
            backgroundPosition: "left",
            height:"413px",
            backgroundRepeat: "no-repeat",
            opacity: 0.34
          }}
          className="absolute md:block hidden inset-0 top-36 pointer-events-none"
        />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          
          {/* Testimonials Content */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
            {/* Left Side - Profile Images */}
            <div className="flex md:flex-col flex-row gap-3 md:gap-4 overflow-x-auto md:overflow-visible w-full md:w-auto pb-2 md:pb-0">
              {TestimonialsData.map((testimonial) => {
                const isSelected = selectedTestimonial === testimonial.id;
                
                return (
                  <div
                    key={testimonial.id}
                    onClick={() => setSelectedTestimonial(testimonial.id)}
                    className={`rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 flex-shrink-0 ${
                      isSelected
                        ? "w-[100px] h-[130px] md:w-[140px] md:h-[180px] border-2 border-[#C7A97B] opacity-100"
                        : "w-[100px] h-[70px] md:w-[140px] md:h-[90px] opacity-60 hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={140}
                      height={140}
                      className="object-cover w-full h-full"
                    />
                  </div>
                );
              })}
            </div>
            
            {/* Right Side - Testimonial Card */}
            <div className="flex-1 w-full border rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 min-h-[280px] sm:min-h-[320px] md:min-h-[380px] flex flex-col justify-center">
              {TestimonialsData.map((testimonial) => {
                if (selectedTestimonial === testimonial.id) {
                  return (
                    <div key={testimonial.id} className="animate-fadeIn">
                      <blockquote className="text-black text-[18px] sm:text-[22px] md:text-[28px] lg:text-[32px] font-light leading-relaxed mb-6 md:mb-8 italic">
                        &ldquo;{testimonial.testimonial}&rdquo;
                      </blockquote>
                      
                      <p className="text-black text-[14px] sm:text-[15px] md:text-[16px] font-light">
                        {testimonial.name}
                      </p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </section>



      {/* Upcoming Events section */}

      <section className="w-full py-[40px] md:py-[68px] ">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-black text-[28px] sm:text-[32px] md:text-[40px] font-normal mb-8 md:mb-12">
            Upcoming Events
          </h2>
          
          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {UpcomingEventsData.map((event) => (
              <div key={event.id} className="flex flex-col">
                <div className="relative w-[193px] h-[128px] rounded-2xl overflow-hidden mb-4">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[#1C3163] text-[14px] sm:text-[15px] md:text-[24px] font-normal">
                    {event.date}
                  </p>
                  <h3 className="text-[#1C3163] text-[12px] sm:text-[13px] md:text-[20px] font-light leading-tight">
                    {event.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      </div>
      <Footer/>   
    </>
  );
};

export default Index;
