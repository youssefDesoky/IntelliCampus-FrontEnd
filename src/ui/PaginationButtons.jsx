import Button from "./Button";

// Icons
import { AngleDownIcon } from "./icons";

export default function PaginationButtons ({ buttonsNumber }) {
    const buttonStyle = "px-4 py-2 rounded-md bg-surface-bg-light dark:bg-surface-bg-dark border border-default-border-light dark:border-default-border-dark text-primary-text-light dark:text-primary-text-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200";

    return (
        <div id="smart-notes-pagination" className="flex justify-center gap-4 mt-8">
            <Button className={buttonStyle}>
                <AngleDownIcon className="rotate-90 w-5 h-5" />
            </Button>
            
            {[...Array(buttonsNumber)].map((_, index) => (
                <Button 
                    key={index} 
                    className={`px-4 py-2 rounded-md ${
                        index === 0 
                        ? "bg-accent-light text-accent-text-light dark:bg-accent-dark dark:text-accent-text-dark" 
                        : buttonStyle
                    }`}
                >
                    {index + 1}
                </Button>
            ))}

            <Button className={buttonStyle}>
                <AngleDownIcon className="-rotate-90 w-5 h-5" />
            </Button>
        </div>
    );
}