"use client";

export default function SkeletonLoader({ className = "" }) {
  return (
    <div className={`animate-pulse ${className}`} role="status" aria-label="loading">
      <div className="mx-auto w-[70%] max-w-2xl bg-gray-200 dark:bg-gray-600/20 rounded-lg p-8">
        {/* Title */}
        <div className="h-8 md:h-10 bg-gray-300 dark:bg-gray-500 rounded mb-5 w-2/3" />

        {/* Choose image label + button */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-6 w-24 bg-gray-300 dark:bg-gray-500 rounded" />
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-500 rounded" />
        </div>

        {/* Image area */}
        <div className="w-full h-60 md:h-72 bg-gray-300 dark:bg-gray-500 rounded-lg mb-4" />

        {/* Optional preview strip */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-20 w-32 bg-gray-300 dark:bg-gray-500 rounded" />
          <div className="h-20 w-32 bg-gray-300 dark:bg-gray-500 rounded" />
          <div className="h-20 w-32 bg-gray-300 dark:bg-gray-500 rounded" />
        </div>

        {/* Content textarea */}
        <div className="h-32 md:h-40 bg-gray-300 dark:bg-gray-500 rounded mb-5 w-full" />

        {/* Submit button */}
        <div className="h-10 md:h-12 bg-gray-300 dark:bg-gray-500 rounded w-full" />
      </div>
    </div>
  );
}
