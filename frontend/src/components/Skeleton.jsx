import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white p-4 journal-border rounded animate-pulse">
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 bg-gray-200 rounded mr-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded w-14"></div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 3 }) {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-3"></div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 rounded mb-2"></div>
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="animate-pulse space-y-2">
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded"
          style={{ width: i === lines - 1 ? '75%' : '100%' }}
        ></div>
      ))}
    </div>
  );
}

function Skeleton({ type = 'card', ...props }) {
  switch (type) {
    case 'card':
      return <SkeletonCard {...props} />;
    case 'table':
      return <SkeletonTable {...props} />;
    case 'text':
      return <SkeletonText {...props} />;
    default:
      return <SkeletonCard {...props} />;
  }
}

export default Skeleton;
