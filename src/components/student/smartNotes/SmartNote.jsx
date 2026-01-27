import { EllipsisVerticalIcon, FahimIcon, ClockIcon, CalendarIcon } from "../../../ui/icons";
import { useState, useRef, useEffect } from "react";
import Button from "../../../ui/Button";

export default function SmartNote({ note }) {
    const paragraphStyles = "text-sm text-secondary-text-light dark:text-secondary-text-dark";
    const iconStyles = "w-4 h-4 text-icon-secondary-default-light dark:text-icon-primary-default-dark";
    
    const cardRef = useRef(null);
    const [cardWidth, setCardWidth] = useState(0);

    useEffect(() => {
        const updateWidth = () => {
            if (cardRef.current) {
                setCardWidth(cardRef.current.offsetWidth);
            }
        };

        updateWidth();

        const resizeObserver = new ResizeObserver(updateWidth);
        if (cardRef.current) {
            resizeObserver.observe(cardRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);
    
    return(
        <div 
            ref={cardRef}
            className="min-w-70 hover:shadow-lg shadow-sm shadow-shadow-light dark:shadow-shadow-dark p-4 md:p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark flex flex-col gap-4"
        >
            <div className="flex justify-between items-start gap-4 relative">
                <div className="flex flex-col gap-2 min-w-0">
                    <h3 className="text-lg font-bold text-text-primary-active-light dark:text-text-primary-active-dark truncate">{note.title}</h3>
                    <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark line-clamp-3">{note.content}</p>
                </div>
                <Button className="relative top-0 right-0 cursor-none">
                    <EllipsisVerticalIcon className="w-6 h-6 text-gray-600 hover:text-blue-500 transition-colors duration-200"/>
                </Button>
            </div>

            <div className="flex justify-between gap-3 border-t border-border-primary-default-light dark:border-border-primary-default-dark pt-4">
                <div className={`flex gap-1 text-sm ${cardWidth < 420 ? "flex-col items-start gap-1" : "flex-row gap-4 items-center"}`}>
                    <div className="flex gap-1 items-center">
                        <CalendarIcon className={iconStyles} />
                        <p className={paragraphStyles}>{note.creationDate}</p>
                    </div>

                    <div className="flex gap-1 items-center">
                        <ClockIcon className={iconStyles} />
                        <p className={paragraphStyles}>{note.modified}</p>
                    </div>
                </div>

                <Button type="primary">
                    <FahimIcon className="w-6 h-6" />
                    {cardWidth >= 320 && <span className="text-sm font-semibold">AI Summarize</span>}
                </Button>
            </div>
        </div>
    );
}