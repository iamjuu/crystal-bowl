'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'
import { About1 } from '@/public/assets'

type ApiBlog = {
  _id: string;
  name: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

type DisplayBlog = {
  id: string;
  image: string | typeof About1;
  title: string;
  description: string;
  author: string;
  views: string;
};

const BlogPage = () => {
  const [blogsData, setBlogsData] = useState<DisplayBlog[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get image URL
  const getImageUrl = (imageUrl?: string): string | typeof About1 => {
    if (!imageUrl) return About1;
    if (imageUrl.startsWith("data:image")) return imageUrl;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
    return `data:image/jpeg;base64,${imageUrl}`;
  };

  // Helper function to format views (placeholder - can be enhanced with actual view tracking)
  const formatViews = (): string => {
    // For now, return a placeholder. You can implement actual view tracking later
    return "10 views";
  };

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blogs");
      const data = await response.json();
      
      if (data.success && data.data) {
        const apiBlogs: ApiBlog[] = data.data;
        
        // Transform API blogs to display format
        const transformedBlogs: DisplayBlog[] = apiBlogs.map((blog) => ({
          id: blog._id,
          image: getImageUrl(blog.imageUrl),
          title: blog.title,
          description: blog.description,
          author: blog.name || "Anonymous",
          views: formatViews()
        }));

        setBlogsData(transformedBlogs);
      } else {
        setBlogsData([]);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      setBlogsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className=' bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen'>
      <Navbar />
      <div className="w-full ">
        <section className="w-full px-4 md:px-8 py-[68px]">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex  items-center md:mb-12 mb-8 gap-[50px]">
                <h2 className="text-[#D5B584] text-[28px] sm:text-[32px] md:text-[40px] font-normal">
                  Blog
                </h2>
                <p className="text-[#1C3163] text-[14px] sm:text-[16px] md:text-[18px] font-light">
            Resonances that ground, stabilize, and root you in the wisdom of nature.
                </p>
              </div>

            {/* Blog List */}
            {loading ? (
              <div className="text-center py-12 text-[#1C3163]">Loading blogs...</div>
            ) : blogsData.length === 0 ? (
              <div className="text-center py-12 text-[#1C3163]">No blogs available</div>
            ) : (
              <div className="w-full space-y-6">
                {blogsData.map((blog) => (
                  <div key={blog.id} className="bg-[#D9D9D9] w-full rounded-[20px] p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 shadow-sm">
                    {/* Left Side - Blog Image */}
                    <div className="w-full md:w-[50%] flex-shrink-0">
                      <div className="relative w-full aspect-[14/10] rounded-[12px] overflow-hidden">
                        {typeof blog.image === "string" ? (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </div>

                  {/* Right Side - Blog Content */}
                  <div className="w-full md:w-[50%] flex flex-col justify-between py-2">
                    <div className='h-full flex flex-col justify-between border-b border-black/20  '>
                      <div  className=''>
                      <h2 className="text-[#1C3163]  text-[18px] md:text-[20px] lg:text-[22px] font-normal mb-3 md:mb-4 leading-snug">
                        {blog.title}
                      </h2>
                      
                      <p className="text-[#1C3163] text-[13px] md:text-[14px] lg:text-[15px] font-light leading-relaxed mb-4 md:mb-6">
                        {blog.description}
                      </p>
                      </div>
                      <div className='mb-5'>
                      <p className="text-[#1C3163] text-[13px] md:text-[14px] font-normal">
                        {blog.author}
                      </p>
                      </div>
                    </div>

                    {/* Author and Views */}
                    <div className="flex items-center justify-between pt-2 my-2">
                    
                      <p className="text-[#1C3163] text-[11px] md:text-[12px] font-light">
                        {blog.views}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default BlogPage
