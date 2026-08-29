import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'emerald' | 'purple' | 'amber';
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = true,
  color = 'blue',
  size = 'md'
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const colorClasses = {
    blue: 'bg-blue-600',
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-600',
    amber: 'bg-amber-500'
  }[color];

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  }[size];

  return (
    <div className="w-full font-mono">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
          {label && <span className="uppercase tracking-wider">{label}</span>}
          {showPercentage && <span className="text-slate-900 dark:text-white font-bold">{clamped}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ${sizeClasses}`}>
        <div
          className={`${sizeClasses} ${colorClasses} rounded-full transition-all duration-500`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
