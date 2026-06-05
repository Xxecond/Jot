"use client";

export default function ProgressBar({ 
  height = "h-1", 
  color = "bg-cyan-800 dark:bg-cyan-300",
  bgColor = "bg-gray-200 dark:bg-gray-700",
  className = ""
}) {
  return (
    <div 
      className={`w-2/4 ${bgColor} rounded-full overflow-hidden ${height} ${className}`}
      role="status"
      aria-label="loading"
    >
      <div
        className={`${height} ${color} rounded-full`} style={{animation:"progress 2s ease-out ",}}
      />
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%;}
          30% { width: 50%; }
          50% {width: 80%;}
          90% {width:90%}
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
