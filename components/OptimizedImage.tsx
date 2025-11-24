
import React, { useState } from 'react';
import { ImageIcon } from './Icons';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt, className = '', ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative overflow-hidden bg-gray-800 ${className}`}>
      {/* Placeholder / Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 animate-pulse z-10">
          <ImageIcon className="w-8 h-8 text-gray-700" />
        </div>
      )}

      {/* Error State */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-gray-500 z-10">
          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
          <span className="text-xs">Image unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isLoading ? 'scale-110 blur-lg opacity-0' : 'scale-100 blur-0 opacity-100'
          }`}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
