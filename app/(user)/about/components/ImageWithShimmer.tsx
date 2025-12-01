'use client'

import { useState } from 'react'
import Image, { StaticImageData } from 'next/image'

interface ImageWithShimmerProps {
  src: StaticImageData | string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
}

const ImageWithShimmer = ({ 
  src, 
  alt, 
  width, 
  height, 
  fill, 
  className = '',
  priority = false 
}: ImageWithShimmerProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div className="relative w-full h-full">
      {/* Shimmer Placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#D5B584]/20 via-[#D5B584]/40 to-[#D5B584]/20 rounded-lg overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#D5B584]/20 to-[#FEC1A2]/20 rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <svg 
              className="w-12 h-12 mx-auto mb-2 text-[#D5B584]/50" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-[#1C3163]/60 text-sm">Image not available</p>
          </div>
        </div>
      )}

      {/* Actual Image */}
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          className={`${className} transition-opacity duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
          priority={priority}
        />
      )}
    </div>
  )
}

export default ImageWithShimmer

