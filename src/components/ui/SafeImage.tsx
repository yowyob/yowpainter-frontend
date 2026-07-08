'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends ImageProps {
  fallbackSrc?: string;
}

/**
 * A wrapper around Next.js Image component that handles errors gracefully
 * by switching to a fallback image if the primary one fails to load.
 */
export function SafeImage({ 
  src, 
  alt, 
  fallbackSrc = '/images/placeholder.png', 
  ...props 
}: SafeImageProps) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setImgSrc(src);
    setError(false);
  }

  return (
    <Image
      {...props}
      src={error ? fallbackSrc : imgSrc}
      alt={alt}
      onError={() => {
        if (!error) {
          setError(true);
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}
