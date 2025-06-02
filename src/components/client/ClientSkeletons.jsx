import React, { memo } from 'react';

const ClientCardSkeleton = memo(() => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse">
    {/* Header */}
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>

    {/* Body */}
    <div className="p-6 space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
          <div className="h-5 bg-gray-200 rounded w-20"></div>
        </div>
      </div>

      {/* Dates */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-24 mt-2"></div>
      </div>

      {/* Weekly Schedule */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
        <div className="flex flex-wrap gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
));

ClientCardSkeleton.displayName = 'ClientCardSkeleton';

const ClientListSkeleton = memo(({ count = 6 }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array.from({ length: count }, (_, index) => (
      <ClientCardSkeleton key={index} />
    ))}
  </div>
));

ClientListSkeleton.displayName = 'ClientListSkeleton';

export { ClientCardSkeleton, ClientListSkeleton };
