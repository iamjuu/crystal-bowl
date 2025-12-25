"use client";
import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/user/Navbar";
import Image from "next/image";
import localFont from "next/font/local";
import {
  Bucket1,
  Bucket2,
  Bucket3,
  Intention,
  LightWeight,
  ServiceImage1,
  ServiceImage2,
  ServiceImage3,
  TestimonialIcon,
  UniqueToYou,
  UpcomingEvent1,
  UpcomingEvent2,
  UpcomingEvent3,
  UpcomingEvent4,
  Yoga1,
  Yoga2,
  Yoga3,
  YogaSection1,
  YogaSection2,
  YogaSection3
} from "@/public/assets";

import Footer from "@/components/user/Footer";
import { PremiumQuality } from "@/public/assets";
import Link from "next/link";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import AboutSectionComponent from "./components/about/AboutSection";
import CollectionSection from "./components/collection/collectionSection";

// Ivy Mode font configuration
const ivyMode = localFont({
  src: [
    {
      path: "../../../font/Cinzel,DM_Sans,Inter,Manrope,Montserrat,etc (7)/ivy-mode/IvyMode-Regular.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "../../../font/Cinzel,DM_Sans,Inter,Manrope,Montserrat,etc (7)/ivy-mode/IvyMode-Italic.woff2",
      weight: "400",
      style: "italic"
    },
    {
      path: "../../../font/Cinzel,DM_Sans,Inter,Manrope,Montserrat,etc (7)/ivy-mode/IvyMode-Light.woff2",
      weight: "300",
      style: "normal"
    },
    {
      path: "../../../font/Cinzel,DM_Sans,Inter,Manrope,Montserrat,etc (7)/ivy-mode/IvyMode-LightItalic.woff2",
      weight: "300",
      style: "italic"
    },
    {
      path: "../../../font/Cinzel,DM_Sans,Inter,Manrope,Montserrat,etc (7)/ivy-mode/IvyMode-SemiBold.woff2",
      weight: "600",
      style: "normal"
    },
    {
      path: "../../../font/Cinzel,DM_Sans,Inter,Manrope,Montserrat,etc (7)/ivy-mode/IvyMode-SemiBoldItalic.woff2",
      weight: "600",
      style: "italic"
    },
    {
      path: "../../../font/Cinzel,DM_Sans,Inter,Manrope,Montserrat,etc (7)/ivy-mode/IvyMode-Bold.woff2",
      weight: "700",
      style: "normal"
    },
    {
      path: "../../../font/Cinzel,DM_Sans,Inter,Manrope,Montserrat,etc (7)/ivy-mode/IvyMode-BoldItalic.woff2",
      weight: "700",
      style: "italic"
    }
  ],
  variable: "--font-ivy-mode",
  display: "swap"
});

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

const YogaImage = [
  {
    id: 1,
    image: ServiceImage1,
    title: "Sound Healing & Yoga",
    description: "Personalized sessions for deep healing & alignment"
  },
  {
    id: 2,
    image: ServiceImage2,
    title: "Corporate Wellness Programs",
    description: "Stress management & mindfulness for teams"
  },
  {
    id: 3,
    image: ServiceImage3,
    title: "Moon Circles & Group Sound Journeys",
    description: "Community-based healing experiences"
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
    name: "Tanisha M.",
    testimonial:
      "If I were to think of someone who embodies the spirit of yoga, it will be Frankie. She is extremely knowledgeable, genuine and kind. Her classes are delightful, intense and insightful. She explains how each pose is linked to practices of mindfulness and how they promote a better lifestyle. Her cues and tricks to adjust your body to better feel a stretch or pose. She practices what she preaches and I truly think she is one of the best teachers I've ever come across. Thank for you imparting your knowledge"
  },
  {
    id: 2,
    name: "David V.",
    testimonial:
      "I would like to specifically thank Frankie for being such an amazing teacher. As a yogini, she not only has perfect mastery of the poses, but on top of that she has a good understanding of their physiological impact as well as deep knowledge of yogic philosophy. Then as a teacher, she is patient and willing to help, observant both of individual details and the group dynamic as a whole, and her natural enthusiasm and spontaneity are inspiring and turn every class into a wholesome experience. On top of that she teaches a wide range of classes; Hatha Foundation for students who just started their yoga journey, several advanced classes for those looking for a challenge and even sound classes which offer a moment of introspection. In short, Frankie is a world class yoga teacher!"
  },
  {
    id: 3,
    name: "Neeraj K.",
    testimonial:
      "Frankie you are Absolutely amazing and your specific impacts and voice calmness, strength and clarity are superb your teaching style distinctly clear, patient and inspiring. Your wisdom helps off the mat in life balance and mindfulness. Bravo"
  },
  {
    id: 4,
    name: "John V.",
    testimonial:
      "I have struggled with stress and anxiety my entire life, so I decided to give yoga a go this year. Frankie has shared so much knowledge, wisdom and has been an absolute inspiration to me. Frankie has given me the confidence I needed to consistently continue my practice, and I could not have continued without this guiding light. I have now completed more than fifty yoga sessions, so I joined Frankie's Yin, Gong and Crystal Bowl class and was absolutely blown away by this experience. Having struggled to calm my monkey mind and relax all throughout my life this class was incredible. We should all give ourselves this gift of retreat, rest and relaxation."
  },
  {
    id: 5,
    name: "Peter H.",
    testimonial:
      "I am now regularly attending Hatha, Vinyasa Flo, Yin Yang and will most definitely continue Gong classes. Whilst there have certainly been considerable physical benefits after only a few months, its the mental health benefit that is truly life changing for me. I have struggled with depression, anxiety and sleeplessness for most of my life and with my daily yoga practice my mood has been positively lifted, my anxiety is kept in check, and I am sustaining longer and better-quality sleep."
  },
  {
    id: 6,
    name: "Nipun M.",
    testimonial:
      "When the sound vibrations detached my body from the mental awareness and alertness, that's when I felt myself elevating from the weight of my duties, and responsibilities. The detachment brought a sense of peace in a tangible way. I felt oblivion to everything. I really went far and beyond to notice physically where I was. There was a conscious noticeable detachment of physical realm and mental awareness. It certainly works. We should bring this service to corporate professionals. Being under tremendous pressure takes away a lot. But this service felt like a \"much needed magic potion\" to feel my 100% again."
  }
];

const UpcomingEventsData = [
  {
    id: 1,
    image: UpcomingEvent1,
    date: "07 Monday",
    title: "Full Moon Sound Healing Journey"
  },
  {
    id: 2,
    image: UpcomingEvent2,
    date: "10 Thursday",
    title: "Corporate Mindfulness & Stress Release Workshop"
  },
  {
    id: 3,
    image: UpcomingEvent3,
    date: "17 Friday",
    title: "1:1 Sound Healing Availability"
  },
  {
    id: 4,
    image: UpcomingEvent4,
    date: "07 Monday",
    title: "Full Moon Sound Healing Journey"
  }
];

type Category = {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  isFeatured?: boolean;
};

type Event = {
  _id: string;
  title: string;
  date: string;
  day: string;
  time: string;
  imageUrl?: string;
};

type Session = {
  _id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  sessionType?: "regular" | "corporate" | "private" | "discovery" | "freeStudioVisit";
  featured?: boolean;
};

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [featuredCorporateSessions, setFeaturedCorporateSessions] = useState<Session[]>([]);
  const [featuredPrivateSessions, setFeaturedPrivateSessions] = useState<Session[]>([]);

  const [testimonialCurrentIndex, setTestimonialCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Helper to convert base64 string to data URL if needed
  const normalizeImageUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("data:image")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `data:image/jpeg;base64,${url}`;
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (data.success) {
        // Filter only featured categories
        const featuredCategories = data.data.filter(
          (cat: Category) => cat.isFeatured === true
        );
        setCategories(featuredCategories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      if (data.success && data.data) {
        // Filter events that are today or in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = data.data
          .filter((event: Event) => {
            try {
              const eventDate = new Date(event.date);
              eventDate.setHours(0, 0, 0, 0);
              return eventDate >= today;
            } catch {
              return false;
            }
          })
          .sort((a: Event, b: Event) => {
            // Sort by date ascending (nearest first)
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          })
          .slice(0, 4); // Only take the first 4 upcoming events

        setUpcomingEvents(upcoming);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const fetchFeaturedSessions = async () => {
    try {
      const response = await fetch("/api/sessions");
      const data = await response.json();
      if (data.success && data.data) {
        // Filter featured corporate sessions (limit 3)
        const corporate = data.data
          .filter((session: Session) => 
            session.sessionType === "corporate" && session.featured === true
          )
          .slice(0, 3);
        
        // Filter featured private sessions (limit 3)
        const privateSessions = data.data
          .filter((session: Session) => 
            session.sessionType === "private" && session.featured === true
          )
          .slice(0, 3);

        setFeaturedCorporateSessions(corporate);
        setFeaturedPrivateSessions(privateSessions);
      }
    } catch (error) {
      console.error("Failed to fetch featured sessions:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchUpcomingEvents();
    fetchFeaturedSessions();
  }, []);

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
          <source
            src="/assets/images/landing/video/hero.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        <div className="relative z-10 h-full flex flex-col justify-between w-full">
          <Navbar />

          <div className="relative">
            <h1
              className={`${ivyMode.className} text-center pb-[60px] sm:pb-[80px] md:pb-[100px] lg:pb-[120px] px-4 text-[#D5B584] text-[28px] sm:text-[32px] md:text-[40px] lg:text-[50px] italic leading-tight`}
            >
              The go-to crystal bowls for <br /> sound healers worldwide.
            </h1>

            {/* Mute/Unmute Button */}
            <button
              onClick={toggleMute}
              className="fixed z-50 bottom-20 left-1 size-18 flex justify-center items-center rounded-full p-4 bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-all duration-300 border border-[#D5B584]/30"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6  text-[#D5B584]" />
              ) : (
                <Volume2 className="w-6 h-6 sm:w-6 sm:h-6 text-[#D5B584]" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="w-full bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2]">
        {/* about section  */}
        <AboutSectionComponent />

        {/* collection section  */}

        <CollectionSection categories={categories} loading={loading} />

        {/* service section  */}

        <section className="w-full py-[40px] md:py-[68px] ">
          <div className="max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="mb-8 md:mb-12 flex    flex-col sm:flex-row gap-4 sm:gap-8 md:gap-[62px]">
              <h2 className="text-[#D5B584] text-[28px] sm:text-[32px] md:text-[40px] font-normal">
                Services
              </h2>
              <p className="text-black text-[14px] mt-3 sm:text-[16px] md:text-[18px] font-light">
                Private Sessions & <br /> Corporate Wellness
              </p>
            </div>

            {/* First Row - Featured Corporate Sessions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-12 gap-y-8 md:gap-y-16 mb-12 md:mb-16">
              {featuredCorporateSessions.length > 0 ? (
                featuredCorporateSessions.map((session) => {
                  const imageUrl = session.imageUrl
                    ? session.imageUrl.startsWith("data:") || session.imageUrl.startsWith("http")
                      ? session.imageUrl
                      : `data:image/jpeg;base64,${session.imageUrl}`
                    : ServiceImage1;
                  
                  return (
                    <div
                      key={session._id}
                      className="flex w-full items-end justify-between group"
                    >
                      {/* Image Container - Left Side */}
                      <div className="relative aspect-3/4 w-[50%] rounded-2xl md:rounded-3xl overflow-hidden shrink-0">
                        <Image
                          src={imageUrl}
                          alt={session.title || "Corporate Session"}
                          fill
                          className="object-cover group-hover:scale-110 group-hover:brightness-110 transition-all duration-500 ease-out"
                        />
                      </div>

                      {/* Content - Right Side */}
                      <div className="flex w-[40%] h-full justify-between flex-col">
                        <h3 className="text-black pt-4 sm:pt-6 md:pt-[30px] text-[10px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-normal leading-tight line-clamp-2">
                          {session.title || "Corporate Session"}
                        </h3>
                        <div className="flex-col gap-3 sm:gap-4 md:gap-[27px] flex">
                          <p className="text-black text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-light leading-relaxed line-clamp-2">
                            {session.description || ""}
                          </p>
                          {/* Arrow Button */}
                          <Link href="/services">
                            <button className="size-[18px] sm:size-[20px] md:size-[22px] rounded-full border-1 border-[#1C3163] flex items-center justify-center hover:bg-[#1C3163] transition-colors group">
                              <ArrowRight
                                className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-black hover:text-white"
                                strokeWidth={0.9}
                              />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Fallback to static data if no featured corporate sessions
                YogaImage.map((item) => (
                  <div
                    key={item.id}
                    className="flex w-full items-end justify-between group"
                  >
                    {/* Image Container - Left Side */}
                    <div className="relative aspect-3/4 w-[50%] rounded-2xl md:rounded-3xl overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 group-hover:brightness-110 transition-all duration-500 ease-out"
                      />
                    </div>

                      {/* Content - Right Side */}
                      <div className="flex w-[40%] h-full justify-between flex-col">
                        <h3 className="text-black pt-4 sm:pt-6 md:pt-[30px] text-[10px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-normal leading-tight line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="flex-col gap-3 sm:gap-4 md:gap-[27px] flex">
                          <p className="text-black text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-light leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        {/* Arrow Button */}
                        <Link href="/services">
                          <button className="size-[18px] sm:size-[20px] md:size-[22px] rounded-full border-1 border-[#1C3163] flex items-center justify-center hover:bg-[#1C3163] transition-colors group">
                            <ArrowRight
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-black hover:text-white"
                              strokeWidth={0.9}
                            />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Second Section Header */}
            <div className="mb-8 md:mb-12 mt-12 md:mt-20">
              <h2 className="text-black text-[13px] sm:text-[14px] md:text-[16px] font-normal leading-tight">
                Journey to Healing:
                <br />
                Sound & Music for Creatives
              </h2>
            </div>

            {/* Second Row - Featured Private Sessions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-12 gap-y-8 md:gap-y-16 mb-12 md:mb-16">
              {featuredPrivateSessions.length > 0 ? (
                featuredPrivateSessions.map((session) => {
                  const imageUrl = session.imageUrl
                    ? session.imageUrl.startsWith("data:") || session.imageUrl.startsWith("http")
                      ? session.imageUrl
                      : `data:image/jpeg;base64,${session.imageUrl}`
                    : YogaSection1;
                  
                  return (
                    <div
                      key={session._id}
                      className="flex w-full items-end justify-between group"
                    >
                      {/* Image Container - Left Side */}
                      <div className="relative aspect-3/4 w-[50%] rounded-2xl md:rounded-3xl overflow-hidden shrink-0">
                        <Image
                          src={imageUrl}
                          alt={session.title || "Private Session"}
                          fill
                          className="object-cover group-hover:scale-125 group-hover:rotate-2 group-hover:opacity-90 transition-all duration-700 ease-in-out"
                        />
                      </div>

                      {/* Content - Right Side */}
                      <div className="flex w-[40%] h-full justify-between flex-col">
                        <h3 className="text-black pt-4 sm:pt-6 md:pt-[30px] text-[10px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-normal leading-tight line-clamp-2">
                          {session.title || "Private Session"}
                        </h3>
                        <div className="flex-col gap-3 sm:gap-4 md:gap-[27px] flex">
                          {/* Arrow Button */}
                          <Link href="/services">
                            <button className="size-[18px] sm:size-[20px] md:size-[22px] rounded-full border-1 border-[#1C3163] flex items-center justify-center hover:bg-[#1C3163] hover:text-white transition-colors group">
                              <ArrowRight
                                className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 hover:text-white"
                                strokeWidth={0.9}
                              />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Fallback to static data if no featured private sessions
                CreativeJourneyData.map((item) => (
                  <div
                    key={item.id}
                    className="flex w-full items-end justify-between group"
                  >
                    {/* Image Container - Left Side */}
                    <div className="relative aspect-3/4 w-[50%] rounded-2xl md:rounded-3xl overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-125 group-hover:rotate-2 group-hover:opacity-90 transition-all duration-700 ease-in-out"
                      />
                    </div>

                      {/* Content - Right Side */}
                      <div className="flex w-[40%] h-full justify-between flex-col">
                        <h3 className="text-black pt-4 sm:pt-6 md:pt-[30px] text-[10px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-normal leading-tight line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="flex-col gap-3 sm:gap-4 md:gap-[27px] flex">
                          {/* Arrow Button */}
                        <Link href="/services">
                          <button className="size-[18px] sm:size-[20px] md:size-[22px] rounded-full border-1 border-[#1C3163] flex items-center justify-center hover:bg-[#1C3163] hover:text-white transition-colors group">
                            <ArrowRight
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 hover:text-white"
                              strokeWidth={0.9}
                            />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* testimonials section  */}

        <section className="w-full py-[40px] md:py-[68px]  relative">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-[#D5B584] text-[28px] sm:text-[32px] md:text-[40px] font-normal mb-8 md:mb-12">
              What our Clients are saying..
            </h2>
          </div>
          <div
            style={{
              backgroundImage: `url(${TestimonialIcon.src})`,
              backgroundSize: "contain",
              backgroundPosition: "left",
              height: "413px",
              backgroundRepeat: "no-repeat",
              opacity: 0.34
            }}
            className="absolute md:block hidden inset-0 top-36 pointer-events-none"
          />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="relative">
              {/* Carousel Container */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${testimonialCurrentIndex * 100}%)`
                  }}
                >
                  {TestimonialsData.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="min-w-full flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center"
                    >
                 
                      {/* Right Side - Testimonial Card */}
                      <div className="flex-1 w-full border rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 flex flex-col justify-center h-[200px] sm:h-[250px] md:h-[200px] lg:h-[230px]">
                        <div className="animate-fadeIn">
                          <blockquote className="text-black text-[12px] sm:text-[12px] md:text-[14px] lg:text-[14px] font-light leading-relaxed mb-6 md:mb-8 italic">
                            &ldquo;{testimonial.testimonial}&rdquo;
                          </blockquote>

                          <p className="text-black text-[14px] sm:text-[15px] md:text-[16px] font-light">
                            {testimonial.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              {TestimonialsData.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setTestimonialCurrentIndex((prev) =>
                        prev === 0 ? TestimonialsData.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 z-10 hidden md:flex items-center justify-center"
                    aria-label="Previous testimonial"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="#D5B584"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setTestimonialCurrentIndex((prev) =>
                        prev === TestimonialsData.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 z-10 hidden md:flex items-center justify-center"
                    aria-label="Next testimonial"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 18L15 12L9 6"
                        stroke="#D5B584"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Mobile Navigation Buttons */}
              {TestimonialsData.length > 1 && (
                <div className="flex md:hidden justify-center gap-4 mt-6">
                  <button
                    onClick={() =>
                      setTestimonialCurrentIndex((prev) =>
                        prev === 0 ? TestimonialsData.length - 1 : prev - 1
                      )
                    }
                    className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300"
                    aria-label="Previous testimonial"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="#D5B584"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setTestimonialCurrentIndex((prev) =>
                        prev === TestimonialsData.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300"
                    aria-label="Next testimonial"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 18L15 12L9 6"
                        stroke="#D5B584"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* Dots Indicator */}
              {TestimonialsData.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {TestimonialsData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setTestimonialCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === testimonialCurrentIndex
                          ? "bg-[#D5B584] w-8"
                          : "bg-[#D5B584]/30 w-2"
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Upcoming Events section */}

        <section className="w-full py-[40px] md:py-[68px] ">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-[#D5B584] text-[28px] sm:text-[32px] md:text-[40px] font-normal mb-8 md:mb-12">
              Upcoming Events
            </h2>

            {/* Events Grid */}
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12 text-[#1C3163]">
                <p className="text-[16px]">No upcoming events at the moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {upcomingEvents.map((event) => {
                  const eventDate = new Date(event.date);
                  const monthNames = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                  ];
                  const monthAbbr = monthNames[eventDate.getMonth()];
                  const dayNumber = eventDate.getDate();
                  const year = eventDate.getFullYear();

                  // Format date for display: "Nov 7, 2025"
                  const formattedFullDate = `${monthAbbr} ${dayNumber}, ${year}`;

                  // Format time if available
                  const timeDisplay = event.time ? ` · ${event.time}` : "";

                  const imageUrl = event.imageUrl
                    ? event.imageUrl.startsWith("data:") ||
                      event.imageUrl.startsWith("http")
                      ? event.imageUrl
                      : `data:image/jpeg;base64,${event.imageUrl}`
                    : Yoga1;

                  return (
                    <div key={event._id} className="flex flex-col group">
                      <Link href="/events">
                        <div className="relative w-full aspect-[4/3]  overflow-hidden mb-0 group-hover:shadow-2xl transition-all duration-500">
                          <Image
                            src={imageUrl}
                            alt={event.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-all duration-500 ease-out"
                          />
                          {/* Date Badge - Upper Right Corner */}
                          <div className="absolute top-2 right-2 bg-white   px-3 py-2 text-center shadow-lg">
                            <div className="text-[#1C3163] text-[10px] sm:text-[11px] font-medium uppercase leading-tight">
                              {monthAbbr}
                            </div>
                            <div className="text-[#1C3163] text-[18px] sm:text-[20px] md:text-[24px] font-semibold leading-tight">
                              {dayNumber}
                            </div>
                          </div>
                        </div>
                      </Link>
                      {/* Event Details - Light Beige Background */}
                      <div className="px-4 py-5 md:px-5 md:py-6 -mt-2 relative z-10">
                        <h3 className="text-[#8B6F47] text-[14px] sm:text-[15px] md:text-[18px] font-normal leading-tight mb-2 uppercase tracking-wide">
                          {event.title}
                        </h3>
                        <p className="text-[#8B6F47] text-[12px] sm:text-[13px] md:text-[14px] font-light">
                          {formattedFullDate}
                          {timeDisplay}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Index;
