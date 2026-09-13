"use client";

export default function SkeletonLoader({ className = "" }) {
  return (
    <div className={`animate-pulse ${className}`} role="status" aria-label="loading">
      <div className="mx-auto w-full max-w-2xl my-10 bg-gray-200 dark:bg-gray-600/20 rounded-lg p-4 sm:p-8">
        {/* Title */}
        <div className="h-8 md:h-10 bg-gray-300 dark:bg-gray-500 rounded mb-5 w-2/3" />

        {/* Choose image label + button */}
        <div className="flex items-center gap-4 mb-4 w-full">
          <div className="h-6 w-20 min-[510px]:w-24 bg-gray-300 dark:bg-gray-500 rounded" />
          <div className="h-6 w-12 min-[510px]:w-16 bg-gray-300 dark:bg-gray-500 rounded" />
        </div>

        {/* Image area */}
        <div className="w-full h-60 md:h-72 bg-gray-300 dark:bg-gray-500 rounded-lg mb-4" />

        {/* Optional preview strip */}
        <div className="flex items-center justify-center gap-2 min-[510px]:gap-4 mb-4 w-full">
          <div className="h-14 w-24 min-[510px]:h-20 min-[510px]:w-32 bg-gray-300 dark:bg-gray-500 rounded" />
          <div className="h-14 w-24 min-[510px]:h-20 min-[510px]:w-32 bg-gray-300 dark:bg-gray-500 rounded" />
          <div className="h-14 w-24 min-[510px]:h-20 min-[510px]:w-32 bg-gray-300 dark:bg-gray-500 rounded" />
        </div>

        {/* Content textarea */}
        <div className="w-full h-24 md:h-40 bg-gray-300 dark:bg-gray-500 rounded mb-5" />

        {/* Submit button */}
        <div className="w-full h-10 md:h-12 bg-gray-300 dark:bg-gray-500 rounded" />
      </div>
    </div>
  );
}
