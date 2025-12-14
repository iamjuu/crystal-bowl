"use client";

import {
  FooterIcon1,
  FooterIcon2,
  FooterIcon3,
  WhatsAppIcon,
  FacebookIcon,
  YouTubeIcon,
  InstagramIcon
} from "@/public/assets";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUp } from "lucide-react";

const Footer = () => {
  return (
    <section className="w-full py-[40px] md:py-[68px] bg-gradient-to-b from-[#FEC1A2] to-[#FDECE2]">
      <div className="max-w-6xl border-b pb-[64px] border-black items-stretch flex flex-col md:flex-row justify-between mx-auto px-4 gap-6 md:gap-6">
        <div className="hidden md:flex items-start h-full">
          <Image
            src={FooterIcon1}
            alt="footer icon"
            className="w-[60px] lg:w-auto"
          />
        </div>

        <div className="flex flex-col gap-8 md:gap-[64px] items-center text-center">
          <h3 className="text-[black] italic leading-tight text-[26px] sm:text-[32px] md:text-[40px] lg:text-[48px]">
            Ready To Begin Your
            <br className="hidden sm:block" /> Healing Journey?
          </h3>

          <div className="w-full max-w-[560px] flex flex-col gap-3 sm:gap-4">
            {/* Row 1 */}
            <div className="grid items-center grid-cols-[1fr_auto] gap-3 sm:gap-4">
              <Link
                href="/shop"
                className="w-full bg-white text-[#1C3163] rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-left text-[14px] sm:text-[16px] md:text-[18px] hover:bg-white/90 transition-colors"
              >
                Shop Crystal Bowls
              </Link>
              <Link
                href="/shop"
                className="size-[44px] sm:size-[52px] rounded-xl sm:rounded-2xl bg-white text-[#1C3163] flex items-center justify-center hover:bg-white/90 transition-colors"
              >
                <ArrowRight
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  strokeWidth={1.5}
                />
              </Link>
            </div>

            {/* Row 2 */}
            <div className="grid items-center grid-cols-[1fr_auto] gap-3 sm:gap-4">
              <Link
                href="/discoveryappointment"
                className="w-full bg-white text-[#1C3163] rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-left text-[14px] sm:text-[16px] md:text-[18px] hover:bg-white/90 transition-colors"
              >
                Book a Discovery
              </Link>
              <Link
                href="/discoveryappointment"
                className="size-[44px] sm:size-[52px] rounded-xl sm:rounded-2xl bg-white text-[#1C3163] flex items-center justify-center hover:bg-white/90 transition-colors"
              >
                <ArrowRight
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <Image
            src={FooterIcon2}
            alt="footer icon"
            className="w-[60px] lg:w-auto"
          />
        </div>
      </div>

      <div>
        <div className="max-w-6xl flex flex-col md:flex-row py-[44px] mx-auto px-4 gap-8 md:gap-0">
          <div className="w-full md:w-[50%] flex justify-center md:justify-start">
            <Image
              src={FooterIcon3}
              alt="footer icon"
              className="w-[180px] sm:w-[220px] md:w-auto"
            />
          </div>
          <div className="w-full md:w-[50%] font-montserrat font-[200] text-[14px] md:text-[16px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-4">
              <div>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/"
                      className="text-black hover:text-[black] transition-colors"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="/about"
                      className="text-black hover:text-[black] transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/faq"
                      className="text-black hover:text-[black] transition-colors"
                    >
                      Faq
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-black hover:text-[black] transition-colors"
                    >
                      Products
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-black hover:text-[black] transition-colors"
                    >
                      Testimonials
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-black hover:text-[black] transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-black hover:text-[black] transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-black hover:text-[black] transition-colors break-words"
                    >
                      Based in Singapore{" "}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-black hover:text-[black] transition-colors break-words"
                    >
                      mail@frankieyogini@gmail.com{" "}
                    </a>
                  </li>
                
                
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full font-montserrat">
          <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              {/* Left Section - Social Icons and Text */}
              <div className="flex flex-col gap-4">
                {/* Social Media Icons */}
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="size-12 rounded-full border border-black flex items-center justify-center hover:bg-black/10 transition-colors"
                    aria-label="Facebook"
                  >
                    <Image
                      src={FacebookIcon}
                      alt="Facebook"
                      className="w-5 h-5 brightness-0"
                    />
                  </a>
                  <a
                    href="#"
                    className="size-12 rounded-full border border-black flex items-center justify-center hover:bg-black/10 transition-colors"
                    aria-label="WhatsApp"
                  >
                    <Image
                      src={WhatsAppIcon}
                      alt="WhatsApp"
                      className="w-5 h-5 brightness-0"
                    />
                  </a>
                  <a
                    href="#"
                    className="size-12 rounded-full border border-black flex items-center justify-center hover:bg-black/10 transition-colors"
                    aria-label="Instagram"
                  >
                    <Image
                      src={InstagramIcon}
                      alt="Instagram"
                      className="w-5 h-5 brightness-0"
                    />
                  </a>
                  <a
                    href="#"
                    className="size-12 rounded-full border border-black flex items-center justify-center hover:bg-black/10 transition-colors"
                    aria-label="YouTube"
                  >
                    <Image
                      src={YouTubeIcon}
                      alt="YouTube"
                      className="w-5 h-5 brightness-0"
                    />
                  </a>
                </div>

                {/* Copyright and Links */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-black/80 text-[12px] sm:text-[14px] font-light">
                  <p>©{new Date().getFullYear()} — Copyright</p>
                  <div className="flex flex-wrap gap-2 sm:gap-4">
                    <a
                      href="#"
                      className="hover:text-[black] transition-colors"
                    >
                      Terms & Conditions
                    </a>
                    <a
                      href="#"
                      className="hover:text-[black] transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Section - Scroll to Top Button */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="size-12 rounded-full border border-black flex items-center justify-center hover:bg-black/10 transition-colors self-end sm:self-auto"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-5 h-5 text-black" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
