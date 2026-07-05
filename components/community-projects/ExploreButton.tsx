"use client";

interface ExploreButtonProps {
  onClick: () => void;
  className?: string;
}

export function ExploreButton({ onClick, className = '' }: ExploreButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      className={`inline-flex items-center justify-center rounded-full border border-[#00FFA3]/60 bg-transparent px-5 py-3 font-mono text-sm text-[#00FFA3] transition duration-200 hover:bg-[#00FFA3]/10 hover:border-[#00FFA3] focus:outline-none focus:ring-2 focus:ring-[#00FFA3]/40 ${className}`}
    >
      Explore Community Projects
    </button>
  );
}
