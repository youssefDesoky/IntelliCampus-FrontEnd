import { useState, useEffect, useRef } from 'react';
import { AngleDownIcon } from "../ui/icons"

export default function SelectBox({
    options,
    selectedOption,
    label,
    name,
    className,
    labelDirection = "flex-row",
    yPadding = 'py-2',
    onChange,
    compact = false,
    showLabel = true,
    disabled = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [minWidth, setMinWidth] = useState(0);
    const measureRef = useRef(null);
    const rowRef = useRef(null);
    const dropdownRef = useRef(null);

    const toggleOpen = () => {
        if (disabled) return;
        setIsOpen(!isOpen);
    };

    const selected = selectedOption 
        ? options.find(opt => opt.value === selectedOption.value) || selectedOption
        : null;

    useEffect(() => {
        if (measureRef.current) {
            setMinWidth(measureRef.current.offsetWidth);
        }
    }, [options, label, labelDirection, yPadding, selected]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (option) => {
        setIsOpen(false);
        if (onChange) {
            onChange(option);
        }
    };

    // Compact styling adjustments
    const compactClasses = compact ? "text-xs py-1.5 px-2" : "";
    const compactIconSize = compact ? "w-4 h-4" : "w-5 h-5";
    const isFull = className?.includes('w-full');

    // When w-full, skip minWidth so button stretches to fill parent
    const buttonStyle = isFull
        ? {}
        : (!compact && minWidth > 0 ? { minWidth: `${Math.min(minWidth, 320)}px` } : {});
    const dropdownStyle = isFull
        ? { width: '100%' }
        : (!compact && minWidth > 0 ? { minWidth: `${Math.min(minWidth, 320)}px`, maxWidth: '100%' } : { width: '100%' });

    return (
        <div ref={dropdownRef} className={`relative block text-left max-w-full ${className} ${compact ? 'text-xs' : 'text-xs md:text-sm'}`} data-cursor="clickable">
            {/* Hidden input so FormData captures the selected value */}
            {name && <input type="hidden" name={name} value={selected?.value ?? ""} />}
            {/* Hidden element to measure longest option */}
            {!compact && options && options.length > 0 && (
                <div ref={measureRef} className="absolute invisible whitespace-nowrap px-3 py-2">
                    {options.reduce((longest, opt) => {
                        const label = opt?.label || '';
                        return (label && label.length > longest.length) ? label : longest;
                    }, "")}
                    <AngleDownIcon className="w-5 h-5 ml-2 inline" />
                </div>
            )}

            <div
                ref={rowRef}
                className={`flex ${labelDirection} ${labelDirection === "flex-row" ? "items-center" : "items-start"} justify-between gap-2`}
            >
                {showLabel && label && (
                    <label
                        className={`block font-semibold text-text-primary-active-light dark:text-text-primary-active-dark ${compact ? 'text-xs' : 'text-sm'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={toggleOpen}
                    >
                        {label}
                    </label>
                )}
                <button
                    type="button"
                    disabled={disabled}
                    className={`${isFull ? 'w-full' : 'flex-1'} min-w-0 max-w-full inline-flex items-center justify-between rounded-md border border-border-primary-default-light dark:border-border-primary-default-dark shadow-sm px-3 ${yPadding} ${compactClasses} bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark font-medium text-text-primary-default-light dark:text-text-primary-default-dark hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark focus:outline-none transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed`}
                    style={buttonStyle}
                    onClick={toggleOpen}
                >
                    <span className="truncate">{selected?.label || "Select"}</span>
                    <AngleDownIcon className={`${compactIconSize} ml-2 -mr-1 text-icon-secondary-default-light dark:text-icon-secondary-default-dark ${isOpen ? 'transform rotate-180' : ''} transition-transform duration-200`} />
                </button>
            </div>

            {isOpen && (
                <div 
                    className="origin-top-right absolute right-0 mt-1 rounded-md shadow-lg bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark ring-1 ring-black ring-opacity-5 z-50 max-h-60 overflow-y-auto overflow-x-hidden no-scrollbar"
                    style={dropdownStyle}
                >
                    <div className="py-1">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`block px-3 py-2 ${compact ? 'text-xs' : 'text-sm'} text-text-primary-default-light dark:text-text-primary-default-dark hover:bg-bg-surface-primary-active-light dark:hover:bg-bg-surface-primary-active-dark truncate ${
                                    selected?.value === option.value 
                                        ? 'bg-bg-surface-primary-active-light dark:bg-bg-surface-primary-active-dark font-medium text-text-accent-default-light dark:text-text-accent-default-dark' 
                                        : ''
                                }`}
                                data-cursor="clickable"
                                onClick={() => handleSelect(option)}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}