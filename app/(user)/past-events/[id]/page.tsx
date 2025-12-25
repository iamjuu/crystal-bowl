'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'
import { About1 } from '@/public/assets'
import { ArrowLeft } from 'lucide-react'

type ApiPastEvent = {
  _id: string;
  name: string;
  title: string;
  location: string;
  day: string;
  time: string;
  date: string;
  description: string;
  thumbnailImage: string;
  photos?: string[];
  videos?: string[];
  createdAt: string;
  updatedAt: string;
}

const PastEventDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  const [pastEvent, setPastEvent] = useState<ApiPastEvent | null>(null)
  const [loading, setLoading] = useState(true)

  // Helper function to get image URL
  const getImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("data:image")) return imageUrl;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
    return `data:image/jpeg;base64,${imageUrl}`;
  };

  useEffect(() => {
    const fetchPastEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/past-events/${eventId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setPastEvent(data.data);
        } else {
          router.push("/events");
        }
      } catch (error) {
        console.error("Failed to fetch past event:", error);
        router.push("/events");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchPastEvent();
    }
  }, [eventId, router]);

  if (loading) {
    return (
      <div className='bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen'>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-[#1C3163]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1C3163] mx-auto mb-4"></div>
            <p>Loading event...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!pastEvent) {
    return (
      <div className='bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen'>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-[#1C3163]">
            <p className="mb-4">Event not found</p>
            <Link href="/events" className="text-[#D5B584] hover:underline">
              Back to Events
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const eventDate = new Date(pastEvent.date);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[eventDate.getMonth()];
  const dayNumber = eventDate.getDate();
  const year = eventDate.getFullYear();
  const formattedDate = `${monthName} ${dayNumber}, ${year}`;

  const photos = pastEvent.photos || [];
  const videos = pastEvent.videos || [];
  const thumbnailUrl = getImageUrl(pastEvent.thumbnailImage);

  return (
    <div className='bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen'>
      <Navbar />
      
      <div className="w-full py-[40px] md:py-[68px]">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back Button */}
          <Link 
            href="/events"
            className="inline-flex items-center gap-2 text-[#1C3163] hover:text-[#D5B584] mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Events</span>
          </Link>

           {/* Event Header */}
           <div className="mb-8 md:mb-12">
             {/* Title - Centered */}
             <h1 className="text-[#D5B584] text-[32px] sm:text-[36px] md:text-[40px] lg:text-[48px] font-normal mb-6 leading-tight text-center">
               {pastEvent.title}
             </h1>
             
             {/* Date and Time Details - Right Aligned */}
             <div className="flex justify-end">
               <div className="space-y-2 text-right">
                 <p className="text-[#1C3163] text-[16px] md:text-[18px] font-normal">
                   {pastEvent.location}
                 </p>
                 <p className="text-[#1C3163] text-[16px] md:text-[18px] font-light">
                   {formattedDate}
                 </p>
                 <p className="text-[#1C3163] text-[16px] md:text-[18px] font-light">
                   {pastEvent.day} {pastEvent.time}
                 </p>
               </div>
             </div>
           </div>

           {/* Main Thumbnail Image */}
           {thumbnailUrl && (
             <div className="mb-8 md:mb-12">
               <div className="relative w-full aspect-[5/2] rounded-2xl overflow-hidden">
                 <img
                   src={thumbnailUrl}
                   alt={pastEvent.title}
                   className="w-full h-full object-cover"
                 />
               </div>
             </div>
           )}

          {/* Content with Flexible Layout */}
          <div className="space-y-8 md:space-y-12">
            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <div className="text-[#6B5D4F] text-[16px] md:text-[18px] font-light leading-relaxed whitespace-pre-line">
                {pastEvent.description}
              </div>
            </div>

            {/* Media Gallery - Dynamic Layout Based on Content */}
            {(photos.length > 0 || videos.length > 0) && (
              <div className="space-y-8 md:space-y-12">
                {/* Handle different media combinations */}
                 {photos.length === 1 && videos.length === 0 && (
                   <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden">
                     <img
                       src={getImageUrl(photos[0])}
                       alt={`${pastEvent.title} - Photo`}
                       className="w-full h-full object-cover"
                     />
                   </div>
                 )}

                 {photos.length === 2 && videos.length === 0 && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                     {photos.map((photo, index) => {
                       const photoUrl = getImageUrl(photo);
                       return (
                         <div key={index} className="relative w-full aspect-[3/2] rounded-xl overflow-hidden">
                           <img
                             src={photoUrl}
                             alt={`${pastEvent.title} - Photo ${index + 1}`}
                             className="w-full h-full object-cover"
                           />
                         </div>
                       );
                     })}
                   </div>
                 )}

                 {photos.length === 2 && videos.length === 1 && (
                   <div className="space-y-4 md:space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                       {photos.map((photo, index) => {
                         const photoUrl = getImageUrl(photo);
                         return (
                           <div key={index} className="relative w-full aspect-[3/2] rounded-xl overflow-hidden">
                             <img
                               src={photoUrl}
                               alt={`${pastEvent.title} - Photo ${index + 1}`}
                               className="w-full h-full object-cover"
                             />
                           </div>
                         );
                       })}
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                       <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black">
                         {(() => {
                           const video = videos[0];
                           const isYouTube = video.includes('youtube.com') || video.includes('youtu.be');
                           
                           if (isYouTube) {
                             let videoId = '';
                             if (video.includes('youtube.com/watch?v=')) {
                               videoId = video.split('v=')[1]?.split('&')[0] || '';
                             } else if (video.includes('youtu.be/')) {
                               videoId = video.split('youtu.be/')[1]?.split('?')[0] || '';
                             }
                             
                             if (videoId) {
                               return (
                                 <iframe
                                   src={`https://www.youtube.com/embed/${videoId}`}
                                   title={`${pastEvent.title} - Video`}
                                   className="w-full h-full"
                                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                   allowFullScreen
                                 />
                               );
                             }
                           }
                           
                           return (
                             <video
                               src={video}
                               controls
                               className="w-full h-full"
                             >
                               Your browser does not support the video tag.
                             </video>
                           );
                         })()}
                       </div>
                       <div></div>
                     </div>
                   </div>
                 )}

                {/* For other combinations - use grid layout */}
                {(photos.length > 2 || videos.length > 1 || (photos.length > 0 && videos.length > 0 && !(photos.length === 2 && videos.length === 1))) && (
                  <>
                    {/* Photos Grid */}
                    {photos.length > 0 && (
                      <div>
                        {photos.length > 2 && (
                          <h2 className="text-[#D5B584] text-[24px] md:text-[28px] font-normal mb-6">
                            Photos
                          </h2>
                        )}
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                           {photos.map((photo, index) => {
                             const photoUrl = getImageUrl(photo);
                             return (
                               <div key={index} className="relative w-full aspect-[3/2] rounded-xl overflow-hidden">
                                 <img
                                   src={photoUrl}
                                   alt={`${pastEvent.title} - Photo ${index + 1}`}
                                   className="w-full h-full object-cover"
                                 />
                               </div>
                             );
                           })}
                         </div>
                      </div>
                    )}

                     {/* Videos - Staggered Layout (Left Top, Right Top Down) */}
                     {videos.length > 0 && (
                       <div>
                         {videos.length > 1 && (
                           <h2 className="text-[#D5B584] text-[24px] md:text-[28px] font-normal mb-6">
                             Videos
                           </h2>
                         )}
                         {videos.length === 2 ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
                             {/* First video - Left */}
                             <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black">
                               {(() => {
                                 const video = videos[0];
                                 const isYouTube = video.includes('youtube.com') || video.includes('youtu.be');
                                 
                                 if (isYouTube) {
                                   let videoId = '';
                                   if (video.includes('youtube.com/watch?v=')) {
                                     videoId = video.split('v=')[1]?.split('&')[0] || '';
                                   } else if (video.includes('youtu.be/')) {
                                     videoId = video.split('youtu.be/')[1]?.split('?')[0] || '';
                                   }
                                   
                                   if (videoId) {
                                     return (
                                       <iframe
                                         src={`https://www.youtube.com/embed/${videoId}`}
                                         title={`${pastEvent.title} - Video 1`}
                                         className="w-full h-full"
                                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                         allowFullScreen
                                       />
                                     );
                                   }
                                 }
                                 
                                 return (
                                   <video
                                     src={video}
                                     controls
                                     className="w-full h-full"
                                   >
                                     Your browser does not support the video tag.
                                   </video>
                                 );
                               })()}
                             </div>
                             {/* Second video - Right */}
                             <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black">
                               {(() => {
                                 const video = videos[1];
                                 const isYouTube = video.includes('youtube.com') || video.includes('youtu.be');
                                 
                                 if (isYouTube) {
                                   let videoId = '';
                                   if (video.includes('youtube.com/watch?v=')) {
                                     videoId = video.split('v=')[1]?.split('&')[0] || '';
                                   } else if (video.includes('youtu.be/')) {
                                     videoId = video.split('youtu.be/')[1]?.split('?')[0] || '';
                                   }
                                   
                                   if (videoId) {
                                     return (
                                       <iframe
                                         src={`https://www.youtube.com/embed/${videoId}`}
                                         title={`${pastEvent.title} - Video 2`}
                                         className="w-full h-full"
                                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                         allowFullScreen
                                       />
                                     );
                                   }
                                 }
                                 
                                 return (
                                   <video
                                     src={video}
                                     controls
                                     className="w-full h-full"
                                   >
                                     Your browser does not support the video tag.
                                   </video>
                                 );
                               })()}
                             </div>
                           </div>
                         ) : (
                           <div className="relative w-full md:w-[48%] aspect-[4/3] rounded-xl overflow-hidden bg-black">
                             {(() => {
                               const video = videos[0];
                               const isYouTube = video.includes('youtube.com') || video.includes('youtu.be');
                               
                               if (isYouTube) {
                                 let videoId = '';
                                 if (video.includes('youtube.com/watch?v=')) {
                                   videoId = video.split('v=')[1]?.split('&')[0] || '';
                                 } else if (video.includes('youtu.be/')) {
                                   videoId = video.split('youtu.be/')[1]?.split('?')[0] || '';
                                 }
                                 
                                 if (videoId) {
                                   return (
                                     <iframe
                                       src={`https://www.youtube.com/embed/${videoId}`}
                                       title={`${pastEvent.title} - Video`}
                                       className="w-full h-full"
                                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                       allowFullScreen
                                     />
                                   );
                                 }
                               }
                               
                               return (
                                 <video
                                   src={video}
                                   controls
                                   className="w-full h-full"
                                 >
                                   Your browser does not support the video tag.
                                 </video>
                               );
                             })()}
                           </div>
                         )}
                       </div>
                     )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PastEventDetailPage

