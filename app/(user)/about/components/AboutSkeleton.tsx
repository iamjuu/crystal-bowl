const AboutSkeleton = () => {
  return (
    <div className="bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
      {/* Top Image Grid Skeleton - Exact dimensions: 500x500 */}
      <div className="max-w-7xl border-b border-[#D5B584]/30 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid pt-[30px] sm:pt-[40px] md:pt-[54px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="relative overflow-hidden">
              {/* Shimmer Effect - Matches Image dimensions (500x500) */}
              <div className="w-full aspect-square bg-gradient-to-r from-[#D5B584]/20 via-[#D5B584]/40 to-[#D5B584]/20 relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>
            </div>
          ))}
        </div>

        {/* Content Section Skeleton - Exact spacing and dimensions */}
        <div className="w-full py-[40px]">
          <div className="md:w-[70%] w-full">
            {/* Title Skeleton - Matches h1 with spans */}
            <div className="mb-[20px] sm:mb-[25px] md:mb-[30px]">
              <div className="h-[18px] sm:h-[22px] md:h-[30px] bg-[#D5B584]/30 rounded w-[200px] mb-2 relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>
              <div className="space-y-2">
                <div className="h-[16px] sm:h-[18px] md:h-[20px] lg:h-[22px] bg-[#1C3163]/20 rounded w-full relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
                <div className="h-[16px] sm:h-[18px] md:h-[20px] lg:h-[22px] bg-[#1C3163]/20 rounded w-[95%] relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
                <div className="h-[16px] sm:h-[18px] md:h-[20px] lg:h-[22px] bg-[#1C3163]/20 rounded w-[90%] relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
              </div>
            </div>

            <div className="flex flex-col text-[14px] sm:text-[15px] md:text-[16px] font-[300] gap-[20px] sm:gap-[25px] md:gap-[30px]">
              {/* Paragraph Skeletons - Exact text height */}
              {[1, 2].map((item) => (
                <div key={item} className="space-y-2">
                  <div className="h-[14px] sm:h-[15px] md:h-[16px] bg-[#1C3163]/20 rounded w-full relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  </div>
                  <div className="h-[14px] sm:h-[15px] md:h-[16px] bg-[#1C3163]/20 rounded w-[96%] relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  </div>
                  <div className="h-[14px] sm:h-[15px] md:h-[16px] bg-[#1C3163]/20 rounded w-[85%] relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  </div>
                </div>
              ))}

              {/* H2 Heading Skeleton - Exact dimensions */}
              <div className="h-[20px] sm:h-[24px] md:h-[28px] lg:h-[30px] bg-[#D5B584]/30 rounded w-[90%] relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>

              {/* More Content Block */}
              <div className="space-y-[20px] sm:space-y-[25px] md:space-y-[30px]">
                <div className="h-[20px] sm:h-[24px] md:h-[28px] lg:h-[30px] bg-[#1C3163]/20 rounded w-[85%] relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
                <div className="space-y-2">
                  <div className="h-[14px] sm:h-[15px] md:h-[16px] bg-[#1C3163]/20 rounded w-full relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  </div>
                  <div className="h-[14px] sm:h-[15px] md:h-[16px] bg-[#1C3163]/20 rounded w-[93%] relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  </div>
                  <div className="h-[14px] sm:h-[15px] md:h-[16px] bg-[#1C3163]/20 rounded w-[88%] relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  </div>
                </div>
              </div>

              {/* Location Text Skeleton */}
              <div className="h-[14px] sm:h-[15px] md:h-[16px] bg-[#1C3163]/20 rounded w-[70%] relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meet Frankie Section Skeleton - Exact dimensions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[60px] sm:py-[80px] md:py-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content Skeleton */}
          <div className="space-y-6">
            {/* H2 Skeleton - Exact text size */}
            <div className="h-[32px] sm:h-[40px] md:h-[48px] bg-[#D5B584]/30 rounded w-[250px] relative overflow-hidden">
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
            
            <div className="space-y-4">
              {/* First paragraph - larger text (15-26px) */}
              <div className="space-y-2">
                <div className="h-[15px] sm:h-[16px] md:h-[26px] bg-[#1C3163]/20 rounded w-full relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
                <div className="h-[15px] sm:h-[16px] md:h-[26px] bg-[#1C3163]/20 rounded w-[97%] relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
                <div className="h-[15px] sm:h-[16px] md:h-[26px] bg-[#1C3163]/20 rounded w-[92%] relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
              </div>

              {/* Second paragraph - smaller italic text (14-16px) */}
              <div className="space-y-2">
                <div className="h-[14px] sm:h-[15px] md:h-[16px] bg-[#1C3163]/20 rounded w-full relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
                <div className="h-[14px] sm:h-[15px] md:h-[16px] bg-[#1C3163]/20 rounded w-[88%] relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Image Skeleton - Exact dimensions and positioning */}
          <div className="relative w-full flex justify-center lg:justify-end py-8 sm:py-12 md:py-16">
            <div className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-[300px]">
              {/* Background Card Skeleton - Exact dimensions */}
              <div className="absolute top-1/2 left-1/2 w-[220px] h-[380px] sm:w-[260px] sm:h-[440px] md:w-[280px] md:h-[480px] bg-[#1C3163]/30 rounded-[20px] sm:rounded-[25px] md:rounded-[30px] -z-20 -translate-x-1/2 -translate-y-1/2 rotate-90" />
              
              {/* Main Image Skeleton - Exact aspect ratio [3/4] */}
              <div className="relative w-full aspect-[3/4] rounded-[15px] sm:rounded-[18px] md:rounded-[20px] overflow-hidden shadow-2xl z-10 bg-gradient-to-br from-[#D5B584]/30 via-[#D5B584]/20 to-[#D5B584]/30">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSkeleton;

