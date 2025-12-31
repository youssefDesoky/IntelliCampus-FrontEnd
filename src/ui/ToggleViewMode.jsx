import Button from "./Button";

export default function ToggleViewMode({isVertical, firstMode, secondMode, onFirstModeSelect, onSecondModeSelect, firstModeLabel, secondModeLabel, ...props}) {
    const buttonStyle = "px-2 py-1 text-sm font-medium rounded-md ";

    return (
        <div className={`flex ${isVertical ? 'flex-col' : 'flex-row'} items-center gap-1 p-1 border-2 rounded-md border-muted-border-light bg-muted-bg-light dark:border-muted-border-dark dark:bg-muted-bg-dark`} {...props}>
            <Button 
                className={`${buttonStyle} ${firstMode ? 'bg-accent-light text-accent-text-light dark:bg-accent-dark dark:text-accent-text-dark' : 'transition-colors duration-200 text-secondary-text-light hover:text-primary-text-light hover:bg-muted-hover-light dark:text-secondary-text-dark dark:hover:text-primary-text-dark dark:hover:bg-muted-hover-dark'}`} 
                onClick={onFirstModeSelect}
            >
                {firstModeLabel}
            </Button>
            
            <Button 
                className={`${buttonStyle} ${secondMode ? 'bg-accent-light text-accent-text-light dark:bg-accent-dark dark:text-accent-text-dark' : 'transition-colors duration-200 text-secondary-text-light hover:text-primary-text-light hover:bg-muted-hover-light dark:text-secondary-text-dark dark:hover:text-primary-text-dark dark:hover:bg-muted-hover-dark'}`} 
                onClick={onSecondModeSelect}
            >
                {secondModeLabel}
            </Button>
        </div>
    );
}