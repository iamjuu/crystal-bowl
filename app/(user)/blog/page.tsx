'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'
import { About1, About2 } from '@/public/assets'
import { ArrowRight, MoreVertical } from 'lucide-react'

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
  createdAt: string;
};

const BlogPage = () => {
  const [blogsData, setBlogsData] = useState<DisplayBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  // Helper function to get image URL
  const getImageUrl = (imageUrl?: string): string | typeof About1 => {
    if (!imageUrl) return About1;
    if (imageUrl.startsWith("data:image")) return imageUrl;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
    return `data:image/jpeg;base64,${imageUrl}`;
  };

  // Helper function to truncate description
  const truncateDescription = (text: string, maxLength: number = 150): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  // Calculate pagination
  const totalPages = Math.ceil(blogsData.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;
  const currentBlogs = blogsData.slice(startIndex, endIndex);
  const hasMorePages = currentPage < totalPages;

  const handleSeeMore = () => {
    setCurrentPage(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          author: blog.name || "Francesca Wong",
          createdAt: blog.createdAt
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
    <div className='bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen'>
      <Navbar />
      <div className="w-full">
        <section className="w-full px-4 md:px-8 py-[68px]">
          <div className="max-w-5xl mx-auto">
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
              <div className="text-center py-12 text-[#1C3163]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1C3163] mx-auto mb-4"></div>
                <p>Loading blogs...</p>
              </div>
            ) : blogsData.length === 0 ? (
              <div className="text-center py-12 text-[#1C3163]">No blogs available</div>
            ) : (
              <>
                {/* Blog Cards - Vertical List Layout */}
                <div>
                  {currentBlogs.map((blog) => {
                    // Calculate read time (approximate: 200 words per minute)
                    const words = blog.description.split(/\s+/).length;
                    const readTime = Math.ceil(words / 200);
                    const createdDate = new Date(blog.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    });
                    
                    return (
                      <Link key={blog.id} href={`/blog/${blog.id}`}>
                        <div className="bg-white w-full rounded-lg flex flex-col md:flex-row gap-6 md:gap-8 group cursor-pointer hover:shadow-lg transition-shadow duration-300 p-4 md:p-6 mb-6 md:mb-8">
                          {/* Left Side - Blog Image */}
                          <div className="w-full md:w-[40%] lg:w-[35%] flex-shrink-0">
                            <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden">
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
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              {/* Author Info */}
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                  <Image
                                    src={About2}
                                    alt="Author"
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 text-[13px] md:text-[14px]">
                                  <span>{createdDate}</span>
                                  <span>•</span>
                                  <span>{readTime} min read</span>
                                </div>
                                <div className="ml-auto">
                                  <MoreVertical className="w-5 h-5 text-gray-400" />
                                </div>
                              </div>

                              {/* Blog Title */}
                              <h2 className="text-[#1C3163] text-[20px] md:text-[24px] lg:text-[26px] font-semibold mb-3 leading-tight group-hover:text-[#D5B584] transition-colors duration-300">
                                {blog.title}
                              </h2>
                              
                              {/* Blog Description */}
                              <p className="text-[#6B5D4F] text-[14px] md:text-[15px] lg:text-[16px] font-light leading-relaxed">
                                {truncateDescription(blog.description, 150)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  {currentPage > 1 && (
                    <button
                      onClick={handleBack}
                      className="px-6 py-3 bg-white text-[#1C3163] border border-[#1C3163] rounded-lg hover:bg-[#1C3163] hover:text-white transition-colors duration-300 font-medium"
                    >
                      Back
                    </button>
                  )}
                  {hasMorePages && (
                    <button
                      onClick={handleSeeMore}
                      className="px-6 py-3 bg-[#1C3163] text-white rounded-lg hover:bg-[#D5B584] transition-colors duration-300 font-medium"
                    >
                      See More
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default BlogPage
