import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  hasUnsavedChanges?: boolean;
  confirmMessage?: string;
  className?: string;
  id?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label,
  hasUnsavedChanges = false,
  confirmMessage = 'You have unsaved changes. Are you sure you want to go back?',
  className = '',
  id
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(confirmMessage);
      if (!confirmLeave) return;
    }
    onClick();
  };

  return (
    <button
      type="button"
      id={id}
      onClick={handleClick}
      aria-label={label ? `Back to ${label}` : 'Back'}
      className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#434338] hover:text-[#1a1a15] bg-white hover:bg-[#fdfbf7] active:bg-[#f1efe9] border border-[#e8e4db] hover:border-[#D4A373] active:border-[#5A5A40] rounded-xl shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5A5A40] focus-visible:ring-offset-1 cursor-pointer min-h-[44px] select-none ${className}`}
    >
      <ArrowLeft size={16} className="shrink-0 text-[#5A5A40]" />
      <span className="font-semibold tracking-tight">Back</span>
      {label && label !== 'Back' && (
        <span className="hidden sm:inline text-[#8c8c73] font-normal">
          &bull; {label}
        </span>
      )}
    </button>
  );
};
