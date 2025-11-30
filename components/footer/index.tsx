import { FooterIcon1, FooterIcon2, FooterIcon3 } from "@/public/assets";
import Image from "next/image";
import { ArrowRight, ChevronDown, ArrowUp, Share2, MessageCircle, Camera, Play } from "lucide-react";

const index = () => {
  return (
    <section className="w-full py-[40px] md:py-[68px] bg-gradient-to-b from-[#00071A] to-[#1C3163]">
      <div className="max-w-6xl border-b pb-[64px] border-white items-stretch flex justify-between mx-auto px-4 gap-6">
        <div className="flex items-start h-full">
          <Image src={FooterIcon1} alt="footer icon" />
        </div>

        <div className=" flex flex-col  gap-[64px] items-center text-center">
          <h3 className="text-[#D5B584] italic leading-tight text-[26px] sm:text-[32px] md:text-[40px] lg:text-[48px]">
            Ready To Begin Your
            <br className="hidden sm:block" /> Healing Journey?
          </h3>

          <div className="w-full max-w-[560px] mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4">
            {/* Row 1 */}
            <div className="grid  items-center grid-cols-[1fr_auto] gap-3 sm:gap-4">
              <button className="w-full bg-white text-[#1C3163] rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-left text-[14px] sm:text-[16px] md:text-[18px]">
                Shop Crystal Bowls
              </button>
              <button className="size-[44px] sm:size-[52px] rounded-xl sm:rounded-2xl bg-white text-[#1C3163] flex items-center justify-center">
                <ArrowRight
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  strokeWidth={1.5}
                />
              </button>
            </div>

            {/* Row 2 */}
            <div className="grid  items-center grid-cols-[1fr_auto] gap-3 sm:gap-4">
              <button className="w-full bg-white text-[#1C3163] rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-[14px] sm:text-[16px] md:text-[18px]">
                <span>Book a private session</span>
                <ChevronDown
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  strokeWidth={1.5}
                />
              </button>
              <button className="size-[44px] sm:size-[52px] rounded-xl sm:rounded-2xl bg-white text-[#1C3163] flex items-center justify-center">
                <ArrowRight
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  strokeWidth={1.5}
                />
              </button>
            </div>
          </div>
        </div>
        <div>
          <Image src={FooterIcon2} alt="footer icon" />
        </div>
      </div>

      <div>
        <div className="max-w-6xl flex py-[44px] mx-auto px-4">
          <div className="w-[50%]">
            <Image src={FooterIcon3} alt="footer icon" />
          </div>
          <div className="w-[50%] font-montserrat font-[200] text-[16px]">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/home"
                      className="text-white hover:text-[#D5B584] transition-colors"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="/about"
                      className="text-white hover:text-[#D5B584] transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/portfolio"
                      className="text-white hover:text-[#D5B584] transition-colors"
                    >
                      Portfolio
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-white hover:text-[#D5B584] transition-colors"
                    >
                      Products
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-white hover:text-[#D5B584] transition-colors"
                    >
                      Testimonials
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white hover:text-[#D5B584] transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white hover:text-[#D5B584] transition-colors"
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
                      className="text-white hover:text-[#D5B584] transition-colors"
                    >
Singapore                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white hover:text-[#D5B584] transition-colors"
                    >
mail@abcdefghijklmn.com                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white hover:text-[#D5B584] transition-colors"
                    >
+91 989272927                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>


        <div className="w-full border-t font-montserrat border-white/20">
          <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              {/* Left Section - Social Icons and Text */}
              <div className="flex flex-col gap-4">
                {/* Social Media Icons */}
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="size-10 rounded-full border border-white flex items-center justify-center hover:bg-white/10 transition-colors"
                    aria-label="Facebook"
                  >
                    <Share2 className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </a>
                  <a
                    href="#"
                    className="size-10 rounded-full border border-white flex items-center justify-center hover:bg-white/10 transition-colors"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </a>
                  <a
                    href="#"
                    className="size-10 rounded-full border border-white flex items-center justify-center hover:bg-white/10 transition-colors"
                    aria-label="Instagram"
                  >
                    <Camera className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </a>
                  <a
                    href="#"
                    className="size-10 rounded-full border border-white flex items-center justify-center hover:bg-white/10 transition-colors"
                    aria-label="YouTube"
                  >
                    <Play className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </a>
                </div>
                
                {/* Copyright and Links */}
                <div className="flex  gap-2  text-white/80 text-[12px] sm:text-[14px] font-light">
                  <p>©{new Date().getFullYear()} — Copyright</p>
                  <div className="flex gap-4">
                    <a href="#" className="hover:text-[#D5B584] transition-colors">
                      Terms & Conditions
                    </a>
                    <a href="#" className="hover:text-[#D5B584] transition-colors">
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Section - Scroll to Top Button */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="size-12 rounded-full border border-white flex items-center justify-center hover:bg-white/10 transition-colors self-end sm:self-auto"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-5 h-5 text-white" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default index;
