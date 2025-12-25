'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'
import { About1 } from '@/public/assets'
import { ArrowLeft as ArrowLeftIcon, ArrowRight } from 'lucide-react'

type ApiBlog = {
  _id: string;
  name: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

const BlogDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const blogId = params.id as string
  const [blog, setBlog] = useState<ApiBlog | null>(null)
  const [recentBlogs, setRecentBlogs] = useState<ApiBlog[]>([])
  const [otherBlogs, setOtherBlogs] = useState<ApiBlog[]>([])
  const [loading, setLoading] = useState(true)

  // Helper function to get image URL
  const getImageUrl = (imageUrl?: string): string | typeof About1 => {
    if (!imageUrl) return About1;
    if (imageUrl.startsWith("data:image")) return imageUrl;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
    return `data:image/jpeg;base64,${imageUrl}`;
  };

  // Helper function to truncate description
  const truncateDescription = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blogs/${blogId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setBlog(data.data);
        } else {
          router.push("/blog");
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        router.push("/blog");
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentBlogs = async () => {
      try {
        const response = await fetch("/api/blogs");
        const data = await response.json();
        
        if (data.success && data.data) {
          // Filter out current blog
          const filtered = data.data.filter((b: ApiBlog) => b._id !== blogId);
          // Get recent 3-5 blogs
          setRecentBlogs(filtered.slice(0, 5));
          // Get other blogs (next 5-10 blogs)
          setOtherBlogs(filtered.slice(5, 10));
        }
      } catch (error) {
        console.error("Failed to fetch recent blogs:", error);
      }
    };

    if (blogId) {
      fetchBlog();
      fetchRecentBlogs();
    }
  }, [blogId, router]);

  if (loading) {
    return (
      <div className='bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen'>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-[#1C3163]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1C3163] mx-auto mb-4"></div>
            <p>Loading blog...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className='bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen'>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-[#1C3163]">
            <p className="mb-4">Blog not found</p>
            <Link href="/blog" className="text-[#D5B584] hover:underline">
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrl = getImageUrl(blog.imageUrl);

  return (
    <div className='bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen'>
      <Navbar />
      <div className="w-full">
        <section className="w-full px-4 md:px-8 py-[68px]">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-[#1C3163] hover:text-[#D5B584] transition-colors mb-8 group"
            >
              <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[14px] sm:text-[16px] font-normal">Back to Blog</span>
            </Link>

            {/* Blog Detail Content */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Main Content */}
              <div className="flex-1 bg-white rounded-[20px] p-6 md:p-8 lg:p-12 shadow-lg">
              {/* Blog Image */}
              <div className="w-full mb-8">
                <div className="relative w-full aspect-[16/9] rounded-[12px] overflow-hidden">
                  {typeof imageUrl === "string" ? (
                    <img
                      src={imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={imageUrl}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Blog Title */}
              <h1 className="text-[#1C3163] text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-normal mb-6 leading-tight">
                {blog.title}
              </h1>

              {/* Author and Date */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                <p className="text-[#1C3163] text-[14px] md:text-[16px] font-normal">
                  {blog.name || "Anonymous"}
                </p>
                <span className="text-gray-400">•</span>
                <p className="text-gray-600 text-[14px] md:text-[16px] font-light">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {/* Blog Description/Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-[#1C3163] text-[15px] md:text-[16px] lg:text-[18px] font-light leading-relaxed whitespace-pre-line">
                  {blog.description}
                </p>
              </div>
              </div>

              {/* Sidebar */}
              {(recentBlogs.length > 0 || otherBlogs.length > 0) && (
                <div className="lg:w-80 shrink-0 space-y-6">
                  {/* Recent Blogs Section */}
                  {recentBlogs.length > 0 && (
                    <div className="bg-white rounded-[20px] p-6 shadow-lg sticky top-8">
                      <h3 className="text-[#1C3163] text-[20px] md:text-[22px] font-normal mb-6">
                        Recent Blogs
                      </h3>
                      <div className="space-y-6">
                        {recentBlogs.map((recentBlog) => {
                          const recentImageUrl = getImageUrl(recentBlog.imageUrl);
                          return (
                            <Link key={recentBlog._id} href={`/blog/${recentBlog._id}`}>
                              <div className="group cursor-pointer">
                                {/* Blog Image */}
                                <div className="relative w-full aspect-[4/3] rounded-[12px] overflow-hidden mb-3">
                                  {typeof recentImageUrl === "string" ? (
                                    <img
                                      src={recentImageUrl}
                                      alt={recentBlog.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Image
                                      src={recentImageUrl}
                                      alt={recentBlog.title}
                                      fill
                                      className="object-cover"
                                    />
                                  )}
                                </div>
                                {/* Blog Title */}
                                <h4 className="text-[#1C3163] text-[14px] md:text-[16px] font-normal mb-2 leading-tight">
                                  {recentBlog.title}
                                </h4>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Other Blogs Section */}
                  {otherBlogs.length > 0 && (
                    <div className="bg-white rounded-[20px] p-6 shadow-lg">
                      <h3 className="text-[#1C3163] text-[20px] md:text-[22px] font-normal mb-6">
                        More Blogs
                      </h3>
                      <div className="space-y-6">
                        {otherBlogs.map((otherBlog) => {
                          const otherImageUrl = getImageUrl(otherBlog.imageUrl);
                          return (
                            <Link key={otherBlog._id} href={`/blog/${otherBlog._id}`}>
                              <div className="group cursor-pointer">
                                {/* Blog Image */}
                                <div className="relative w-full aspect-[4/3] rounded-[12px] overflow-hidden mb-3">
                                  {typeof otherImageUrl === "string" ? (
                                    <img
                                      src={otherImageUrl}
                                      alt={otherBlog.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Image
                                      src={otherImageUrl}
                                      alt={otherBlog.title}
                                      fill
                                      className="object-cover"
                                    />
                                  )}
                                </div>
                                {/* Blog Title */}
                                <h4 className="text-[#1C3163] text-[14px] md:text-[16px] font-normal mb-2 leading-tight">
                                  {otherBlog.title}
                                </h4>
                                {/* Blog Description Preview */}
                                <p className="text-[#6B5D4F] text-[13px] md:text-[14px] font-light leading-relaxed">
                                  {truncateDescription(otherBlog.description, 100)}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default BlogDetailPage

