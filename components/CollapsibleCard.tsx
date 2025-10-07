import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  startOpen?: boolean;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ title, children, startOpen = false }) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  return (
    <div className="bg-brand-surface">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
        aria-expanded={isOpen}
      >
        <h3 className="text-xl font-bold text-brand-primary">{title}</h3>
        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div 
        className={`transition-[grid-template-rows] duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
            <div className="p-6 border-t border-brand-border/50 -mt-px">
                {children}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleCard;