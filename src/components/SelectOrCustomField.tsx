"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, PenLine, RotateCcw, Search } from "lucide-react";

export interface OptionItem {
  label: string;
  value: string;
  description?: string;
}

interface SelectOrCustomFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: (OptionItem | string)[];
  placeholder?: string;
  allowCustom?: boolean;
  customPlaceholder?: string;
  helperText?: string;
  required?: boolean;
}

export function SelectOrCustomField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  allowCustom = true,
  customPlaceholder = "Type custom value...",
  helperText,
  required = false,
}: SelectOrCustomFieldProps) {
  // Normalize options to OptionItem objects
  const normalizedOptions: OptionItem[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt,
  );

  const isPresetValue = normalizedOptions.some((opt) => opt.value === value);
  const isCustomValue = Boolean(value) && !isPresetValue;

  const [isOpen, setIsOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(isCustomValue);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  // Sync custom mode if incoming value changes externally
  useEffect(() => {
    if (value && !normalizedOptions.some((opt) => opt.value === value)) {
      setIsCustomMode(true);
    }
  }, [value, normalizedOptions]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelectOption = (optValue: string) => {
    onChange(optValue);
    setIsCustomMode(false);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleEnableCustom = () => {
    setIsCustomMode(true);
    setIsOpen(false);
    setTimeout(() => {
      customInputRef.current?.focus();
    }, 50);
  };

  const handleSwitchToPresets = () => {
    setIsCustomMode(false);
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full relative" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {allowCustom && isCustomMode && (
          <button
            type="button"
            onClick={handleSwitchToPresets}
            className="text-[11px] font-semibold text-[#ee6a2c] hover:text-[#d4561b] flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Choose from preset list
          </button>
        )}
      </div>

      {isCustomMode ? (
        // Custom input mode
        <div className="relative">
          <div className="relative flex items-center">
            <input
              ref={customInputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={customPlaceholder}
              className="w-full text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 pr-20 focus:border-[#ee6a2c] focus:ring-2 focus:ring-[#ee6a2c]/10 outline-none transition-all placeholder:text-gray-400"
            />
            <span className="absolute right-2 px-2 py-0.5 text-[10px] font-bold bg-orange-50 text-[#ee6a2c] border border-orange-200/60 rounded-md uppercase tracking-wider pointer-events-none">
              Custom
            </span>
          </div>
        </div>
      ) : (
        // Dropdown select mode
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full text-xs font-medium text-left bg-white border rounded-xl px-3.5 py-2.5 flex items-center justify-between transition-all outline-none ${
              isOpen
                ? "border-[#ee6a2c] ring-2 ring-[#ee6a2c]/10"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className={selectedOption ? "text-gray-800 font-semibold" : "text-gray-400"}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <div className="flex items-center gap-1.5">
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-[#ee6a2c]" : ""
                }`}
              />
            </div>
          </button>

          {/* Floating menu */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/60 p-1.5 z-50 max-h-72 overflow-y-auto">
              {normalizedOptions.length > 5 && (
                <div className="p-1 mb-1 border-b border-gray-100">
                  <div className="relative flex items-center">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search options..."
                      className="w-full text-xs pl-8 pr-2 py-1.5 rounded-lg bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-0.5">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-gray-400 italic">No options found</div>
                ) : (
                  filteredOptions.map((opt) => {
                    const isSelected = opt.value === value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelectOption(opt.value)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? "bg-orange-50/80 text-[#ee6a2c] font-semibold"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{opt.label}</span>
                          {opt.description && (
                            <span className="text-[10px] text-gray-400 font-normal">
                              {opt.description}
                            </span>
                          )}
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#ee6a2c] shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>

              {allowCustom && (
                <div className="mt-1.5 pt-1.5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleEnableCustom}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#ee6a2c] hover:bg-orange-50 flex items-center gap-2 transition-colors"
                  >
                    <PenLine className="w-3.5 h-3.5" />
                    <span>+ Enter custom {label.toLowerCase()}...</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {helperText && <p className="text-[11px] text-gray-400 ml-1">{helperText}</p>}
    </div>
  );
}
