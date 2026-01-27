import { useState, useRef, useEffect } from 'react';
import ArrowDownIcon from './icons/AngleDownIcon';


export default function SelectBox({ options, selectedOption, label, className, yPadding = 'py-2' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(selectedOption);
    const [minWidth, setMinWidth] = useState(0);
    const measureRef = useRef(null);

    const toggleOpen = () => setIsOpen(!isOpen);

    useEffect(() => {
        if (measureRef.current) {
            setMinWidth(measureRef.current.offsetWidth);
        }
    }, [options]);

    return (
        <div className={`relative inline-block text-left ${className} text-xs md:text-sm`} data-cursor="clickable">
            {/* Hidden element to measure longest option */}
            <div ref={measureRef} className="absolute invisible whitespace-nowrap px-3 py-2">
                {options.reduce((longest, opt) => 
                    opt.label.length > longest.length ? opt.label : longest
                , "")}
                <ArrowDownIcon className="w-5 h-5 ml-2 inline" />
            </div>

            <div className="flex flex-row justify-between items-center gap-2">
                {label && (
                    <label 
                        className="block font-semibold text-text-primary-active-light dark:text-text-primary-active-dark text-sm"
                        onClick={toggleOpen}
                    >
                        {label}
                    </label>
                )}
                <button
                    type="button"
                    className={`inline-flex justify-between rounded-md border border-border-primary-default-light dark:border-border-primary-default-dark shadow-sm px-3 ${yPadding} bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none`}
                    style={{ minWidth: minWidth > 0 ? `${minWidth}px` : 'auto' }}
                    onClick={toggleOpen}
                >
                    {options.find(opt => opt.value === selected)?.label || "Select"}
                    <ArrowDownIcon className="w-5 h-5 ml-2 -mr-1 text-icon-secondary-default-light dark:text-icon-secondary-default-dark" />
                </button>
            </div>

            {isOpen && (
                <div 
                    className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-bg-surface-primary-default-light ring-1 ring-border-primary-default-light dark:ring-border-primary-default-dark ring-opacity-5 z-10"
                    style={{ minWidth: minWidth > 0 ? `${minWidth}px` : '100%' }}
                >
                    <div className="py-1">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className="block px-4 py-2 text-text-primary-default-light dark:text-text-primary-default-dark hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap"
                                data-cursor="clickable"
                                onClick={() => {
                                    setSelected(option.value);
                                    setIsOpen(false);
                                }}
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