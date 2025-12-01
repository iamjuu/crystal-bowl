'use client'

import React from 'react'
import Image from 'next/image'
import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'
import { About1 } from '@/public/assets'

const BlogPage = () => {
  const blogsData = [
    {
      id: 1,
      image: About1,
      title: "Lorem ipsum dolor sit amet consectetur.  dolor sit amet",
      description: "Lorem ipsum dolor sit amet consectetur. Nulla eras lacus erim gravida iactus tempus. Sed eget elementum amet sem nulla commodo amet non donec. Vel tellus elit libero diam. Varius tincidunt magna molestie malesuada amet turpis erat.",
      author: "Jhon Jacob",
      views: "10 views"
    },
    {
      id: 2,
      image: About1,
      title: "Lorem ipsum dolor sit amet consectetur.  dolor sit amet",
      description: "Lorem ipsum dolor sit amet consectetur. Nulla eras lacus erim gravida iactus tempus. Sed eget elementum amet sem nulla commodo amet non donec. Vel tellus elit libero diam. Varius tincidunt magna molestie malesuada amet turpis erat.",
      author: "Jhon Jacob",
      views: "10 views"
    },
    {
      id: 3,
      image: About1,
      title: "Lorem ipsum dolor sit amet consectetur.  dolor sit amet",
      description: "Lorem ipsum dolor sit amet consectetur. Nulla eras lacus erim gravida iactus tempus. Sed eget elementum amet sem nulla commodo amet non donec. Vel tellus elit libero diam. Varius tincidunt magna molestie malesuada amet turpis erat.",
      author: "Jhon Jacob",
      views: "10 views"
    },
  ]

  return (
    <>
      <Navbar />
      <div className="w-full bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
        <section className="w-full px-4 md:px-8 py-[68px]">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-12 md:mb-16">
              <h1 className="text-[#D5B584] text-[36px] sm:text-[40px] md:text-[48px] font-light mb-4">
                Blog
              </h1>
              <p className="text-[#1C3163] text-[14px] sm:text-[15px] md:text-[16px] font-light max-w-2xl">
                Resonances that ground, stabilize, and root you in the wisdom of nature.
              </p>
            </div>

            {/* Blog List */}
            <div className="w-full space-y-6">
              {blogsData.map((blog) => (
                <div key={blog.id} className="bg-[#D9D9D9] w-full rounded-[20px] p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 shadow-sm">
                  {/* Left Side - Blog Image */}
                  <div className="w-full md:w-[50%] flex-shrink-0">
                    <div className="relative w-full aspect-[14/10] rounded-[12px] overflow-hidden">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Right Side - Blog Content */}
                  <div className="w-full md:w-[50%] flex flex-col justify-between py-2">
                    <div>
                      <h2 className="text-[#1C3163] text-[18px] md:text-[20px] lg:text-[22px] font-normal mb-3 md:mb-4 leading-snug">
                        {blog.title}
                      </h2>
                      
                      <p className="text-[#1C3163] text-[13px] md:text-[14px] lg:text-[15px] font-light leading-relaxed mb-4 md:mb-6">
                        {blog.description}
                      </p>
                    </div>

                    {/* Author and Views */}
                    <div className="flex items-center justify-between pt-2 border-t border-black/20">
                      <p className="text-[#1C3163] text-[13px] md:text-[14px] font-normal">
                        {blog.author}
                      </p>
                      <p className="text-[#1C3163] text-[11px] md:text-[12px] font-light">
                        {blog.views}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default BlogPage
