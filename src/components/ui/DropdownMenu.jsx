import { createPortal } from "react-dom";

export default function DropdownMenu({children, className = '', direction = 'bottom', position = 'start', portal = false, style = {}, ...props}) {
    const directionMap = {
        top: '-top-2 -translate-y-full mb-2.5',
        bottom: 'top-full mt-2.5',
        left: 'top-0 -left-2 -translate-x-full',
        right: 'top-0 left-full ml-2'
    };

    const positionMap = {
        start: 'left-0',
        middle: 'left-1/2 -translate-x-1/2',
        end: 'right-0'
    };

    const arrowPositionMap = {
        start: 'after:left-2',
        middle: 'after:left-1/2 after:-translate-x-1/2',
        end: 'after:right-2'
    };

    const arrowDirectionMap = {
        top: 'after:top-full after:border-t-border-primary-hover-light dark:after:border-t-border-primary-hover-dark after:border-l-transparent after:border-r-transparent after:border-b-transparent',
        bottom: 'after:bottom-full after:border-b-border-primary-hover-light dark:after:border-b-border-primary-hover-dark after:border-l-transparent after:border-r-transparent after:border-t-transparent',
        left: 'after:left-full after:top-2 after:border-l-border-primary-hover-light dark:after:border-l-border-primary-hover-dark after:border-t-transparent after:border-r-transparent after:border-b-transparent',
        right: 'after:right-full after:top-2 after:border-r-border-primary-hover-light dark:after:border-r-border-primary-hover-dark after:border-l-transparent after:border-t-transparent after:border-b-transparent'
    };

    const directionClass = portal ? '' : (directionMap[direction] || directionMap['bottom']);
    const positionClass = portal ? '' : (positionMap[position] || positionMap['start']);
    const arrowDirectionClass = arrowDirectionMap[direction] || arrowDirectionMap['bottom'];
    const arrowPositionClass = (direction === 'top' || direction === 'bottom') ? (arrowPositionMap[position] || arrowPositionMap['start']) : '';

    const positionType = portal ? 'fixed' : 'absolute';

    const menu = (
        <menu 
            className={`${positionType} after:content-[''] after:border-8 after:absolute bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-hover-light dark:border-border-primary-hover-dark rounded-lg shadow-lg p-3 flex flex-col gap-2 min-w-50 z-[9999] ${directionClass} ${positionClass} ${arrowDirectionClass} ${arrowPositionClass} ${className}`}
            style={style}
            {...props}
        >
            {children}
        </menu>
    );

    if (portal) {
        return createPortal(menu, document.body);
    }

    return menu;
}