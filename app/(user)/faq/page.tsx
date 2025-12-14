"use client";
import React, { useState } from "react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import { Plus, Minus } from "lucide-react";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(2); // Third item open by default

  const faqs = [
    {
      id: 1,
      question: "What sizes do your bowls come in?",
      answer: "Our crystal bowls come in various sizes to suit different healing practices. We offer bowls ranging from small (4-6 inches) for personal use to large (12-14 inches) for group sessions. Each size is carefully crafted to produce specific frequencies and resonances."
    },
    {
      id: 2,
      question: "What's the difference between the 3rd and 4th Octave?",
      answer: "The 3rd octave bowls produce deeper, more grounding frequencies that are ideal for root chakra work and deep meditation. The 4th octave bowls have higher, more ethereal frequencies that are perfect for crown chakra activation and spiritual connection. Each octave offers unique healing properties."
    },
    {
      id: 3,
      question: "What tuning system should I order my bowls in? 432hz vs 528hz",
      answer: "Our bowls are tuned to 432hz as standard (the healing frequency of nature) however we can also make your bowls in 528hz (the miracle frequency of unconditional love) or 440hz (western standard tuning) depending on your preference. If you would like you bowls in an alternative frequency please leave a note on your order at checkout and we can customise your order to your preferred frequency."
    },
    {
      id: 4,
      question: "Can I order bowls in 440hz?",
      answer: "Yes, absolutely! While our standard tuning is 432hz, we can customize your bowls to 440hz (western standard tuning) upon request. Simply leave a note at checkout specifying your preferred frequency, and we'll ensure your bowls are tuned exactly as you need them."
    },
    {
      id: 5,
      question: "Can you help me choose my bowls?",
      answer: "Of course! We're here to help you find the perfect crystal bowls for your practice. You can reach out to us through our contact form, email, or during checkout. We'll guide you through selecting the right size, note, chakra alignment, and frequency based on your healing intentions and practice needs."
    },
    {
      id: 6,
      question: "Can I order my bowls in any note/chakra?",
      answer: "Yes! Each of our bowls can be customized to align with any specific note and chakra. Whether you're looking for root chakra (C), sacral chakra (D), solar plexus (E), heart chakra (F), throat chakra (G), third eye (A), or crown chakra (B), we can create your bowls to match your exact requirements. Just specify your preferences when placing your order."
    },
    {
      id: 7,
      question: "What are your bowls made from?",
      answer: "Our bowls are crafted from 99.9% pure clear quartz crystal, which is known for its powerful healing properties and exceptional sound quality. Each bowl is carefully infused with other crystals and precious elements to enhance its unique energy and resonance. This premium material ensures durability, clarity of sound, and powerful healing frequencies."
    },
    {
      id: 8,
      question: "Do the bowls come with mallets / cases?",
      answer: "Yes! Each bowl purchase includes a high-quality mallet designed specifically for crystal bowl sound healing. We also provide protective cases for safe storage and easy transportation. Our cases are lightweight yet durable, making them perfect for sound healers who travel. The mallets are crafted to produce the optimal resonance and are included at no additional cost with your bowl purchase."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
      <Navbar />

      <section className="w-full py-[40px] md:py-[68px]">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8 md:mb-12 flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-[62px] items-start">
            <h2 className="text-[#D5B584] text-[28px] sm:text-[32px] md:text-[40px] font-normal">
              FAQs
            </h2>
            <p className="text-[#1C3163] text-[14px] sm:text-[16px] md:text-[18px] font-light max-w-md">
              Lorem ipsum dolor sit amet consectetur. Vitae eu venenatis amet hendrerit elementum arcu tempor nisl.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="flex flex-col gap-0">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              
              return (
                <div key={faq.id} className="border-b border-[#1C3163]/20 last:border-b-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full py-6 md:py-8 flex items-center justify-between gap-4 text-left hover:opacity-80 transition-opacity"
                  >
                    <h3 className="text-[#1C3163] text-[14px] sm:text-[16px] md:text-[18px] font-normal flex-1">
                      {faq.question}
                    </h3>
                    <div className="shrink-0">
                      {isOpen ? (
                        <Minus className="w-5 h-5 sm:w-6 sm:h-6 text-[#1C3163]" strokeWidth={1.5} />
                      ) : (
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-[#1C3163]" strokeWidth={1.5} />
                      )}
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="pb-6 md:pb-8 animate-fadeIn">
                      <p className="text-[#1C3163] text-[12px] sm:text-[14px] md:text-[16px] font-light leading-relaxed pr-12 sm:pr-16">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQPage;

