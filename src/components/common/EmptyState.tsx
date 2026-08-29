import React from 'react';
import { LucideIcon, FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderSearch,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="text-center py-10 px-4 bg-[#151B28] rounded border border-slate-800 p-6 my-3 font-mono text-slate-300">
      <div className="w-10 h-10 rounded bg-[#0B0F19] text-slate-500 border border-slate-800 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-wide">{title}</h3>
      <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
