import React from 'react';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/60 ${className}`}
      {...props}
    />
  );
};

export const HotelCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 mb-6">
      {/* Image Skeleton */}
      <Skeleton className="w-full md:w-72 h-48 rounded-xl shrink-0" />
      
      {/* Content Skeleton */}
      <div className="flex-1 flex flex-col py-1">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16 rounded-lg ml-4" />
        </div>
        
        {/* Tags */}
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Bottom Section */}
        <div className="mt-auto flex justify-between items-end border-t border-slate-50 pt-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const FlightCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Airline Info */}
        <div className="flex items-center gap-4 w-full md:w-1/4">
          <Skeleton className="w-12 h-12 rounded-full shrink-0" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Flight Timeline */}
        <div className="flex-1 flex justify-between items-center w-full">
          <div className="text-right space-y-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          
          <div className="flex-1 px-8 flex flex-col items-center">
            <Skeleton className="h-4 w-20 mb-2" />
            <div className="w-full relative flex items-center">
              <Skeleton className="h-[2px] w-full" />
            </div>
            <Skeleton className="h-4 w-16 mt-2" />
          </div>

          <div className="text-left space-y-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        {/* Price & Action */}
        <div className="w-full md:w-1/5 flex flex-col items-end border-r border-slate-100 pr-6 space-y-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};
