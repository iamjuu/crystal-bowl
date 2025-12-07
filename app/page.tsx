'use client'

import Image from "next/image";
import HomePage from "./(user)/home/page"
import Link from "next/link"
import { WhatsAppIconSvg } from "@/public/assets";

export default function Home() {
  return (
    <>
      <HomePage/>
      
      {/* Floating WhatsApp Icon */}
      <Link
        href="https://wa.me/91989272927"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-1 z-50  size-26   flex justify-end rounded-full p-4   transition-all duration-300 hover:scale-110"
        aria-label="Contact us on WhatsApp"
      >
    <Image src={WhatsAppIconSvg} alt="WhatsApp" width={100}  /> 
      </Link>
    </>
  );
}
