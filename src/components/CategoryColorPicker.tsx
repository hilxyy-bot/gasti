import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { AVAILABLE_COLORS } from '../utils/iconMap';

interface CategoryColorPickerProps {
  color: string;
  categoryName: string;
  onChangeColor: (newColor: string) => void;
  size?: 'sm' | 'md';
}

export const CategoryColorPicker: React.FC<CategoryColorPickerProps> = ({
  color,
  categoryName,
  onChangeColor,
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const sizeClasses = size === 'sm' ? 'w-5 h-5' : 'w-7 h-7';

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Color Dot Trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`${sizeClasses} rounded-full transition-transform hover:scale-110 active:scale-95 shadow-md flex items-center justify-center ring-2 ring-zinc-800 hover:ring-zinc-600 focus:outline-none`}
        style={{ backgroundColor: color }}
        title={`Change color for ${categoryName}`}
      >
        <span className="sr-only">Change color</span>
      </button>

      {/* Popover Color Selector */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 mt-2 left-0 sm:left-auto sm:right-0 w-64 p-3 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-100 text-zinc-100"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80">
            <span className="text-xs font-bold text-zinc-200">
              Color for <span className="text-white">{categoryName}</span>
            </span>
            <label className="cursor-pointer inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
              <Palette className="w-2.5 h-2.5" />
              <span>Custom</span>
              <input
                type="color"
                value={color}
                onChange={(e) => onChangeColor(e.target.value)}
                className="sr-only"
              />
            </label>
          </div>

          {/* Palette grid */}
          <div className="grid grid-cols-5 gap-2">
            {AVAILABLE_COLORS.map((c) => {
              const isSelected = color.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    onChangeColor(c);
                    setIsOpen(false);
                  }}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-offset-zinc-950 ring-white scale-110 shadow-md'
                      : 'hover:scale-110 opacity-90 hover:opacity-100'
                  }`}
                  title={c}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
