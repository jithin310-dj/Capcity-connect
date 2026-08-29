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
    <div className="text-center py-10 px-4 bg-slate-50 dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 my-3 font-mono text-slate-700 dark:text-slate-300">
      <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0B0F19] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto mb-3 shadow-2xs">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wide">{title}</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
