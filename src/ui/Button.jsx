export default function Button({isMobile=false, children, onClick, buttonType="primary", ...props}) {
    const primaryButtonStyles = "bg-blue-500 text-white border-blue-600 shadow-inner shadow-blue-400 drop-shadow-accent-light"
    const secondaryButtonStyles = "bg-blue-500 text-white border-blue-600 shadow-inner shadow-blue-400 drop-shadow-accent-light"
    
    return (
        <button 
            className={`
                ${buttonType === "primary" ? primaryButtonStyles : secondaryButtonStyles}
                ${isMobile ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"} 
                flex w-fit gap-2 items-center font-bold rounded-md border drop-shadow-sm
            `}
            onClick={onClick} 
            {...props}
        >
            {children}
        </button>
    );
}