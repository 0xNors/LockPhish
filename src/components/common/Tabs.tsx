import React from 'react';

interface Tab {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-1 border-b border-slate-800/90 overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
              isActive
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {tab.icon}
            {tab.label}
            {typeof tab.count === 'number' && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
