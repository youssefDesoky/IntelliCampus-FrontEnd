export default function Button({
    variant = "primary",
    width = "w-fit",
    loading = false,
    disabled = false,
    loadingText,
    children,
    className = "",
    ...props
}) {
    const base = "px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 h-10 whitespace-nowrap shrink-0";
    const loadingDot = "mx-1 bg-current rounded-full inline-block w-1.5 h-1.5";
    
    const variants = {
        primary: "bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark border border-border-primary-default-light dark:border-border-primary-default-dark",
        secondary: "bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark hover:bg-bg-fill-secondary-active-light dark:hover:bg-bg-fill-secondary-active-dark border border-border-primary-default-light dark:border-border-primary-default-dark",
        danger: "bg-bg-surface-danger-default-light dark:bg-bg-surface-danger-default-dark text-white hover:opacity-90 border border-border-danger-default-light dark:border-border-danger-default-dark",
        success: "bg-bg-fill-success-default-light dark:bg-bg-fill-success-default-dark text-white hover:opacity-90 border border-border-success-default-light dark:border-border-success-default-dark",
        warning: "bg-bg-fill-warning-default-light dark:bg-bg-fill-warning-default-dark text-white dark:text-black hover:opacity-90 border border-border-warning-default-light dark:border-border-warning-default-dark",
    };

    return (
        <button
            className={`${width} ${base} ${variants[variant]} ${
                disabled || loading ? "opacity-50 cursor-not-allowed" : ""
            } ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? 
                <div className="flex items-center justify-center">
                    {loadingText && <span>{loadingText}</span>}
                    <span className={`${loadingDot} animate-bounce`} style={{ animationDelay: "200ms" }}></span>
                    <span className={`${loadingDot} animate-bounce`} style={{ animationDelay: "400ms" }}></span>
                    <span className={`${loadingDot} animate-bounce`} style={{ animationDelay: "600ms" }}></span>
                </div> : 
                children
            }
        </button>
    );
}
