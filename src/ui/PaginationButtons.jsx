import Button from "./Button";

// Icons
import { AngleDownIcon } from "./icons";

export default function PaginationButtons ({ buttonsNumber, currentPage, setCurrentPage }) {
    const buttonStyle = `p-2 rounded-md border border-default-border-light dark:border-default-border-dark 
        bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark 
        hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark disabled:opacity-50 disabled:bg-red-100
    `;

    const showEllipsis = buttonsNumber > 4;

    return (
        <div className="flex justify-center gap-4">
            <button 
                className={buttonStyle} 
                onClick={() => setCurrentPage(prev => prev - 1)} 
                disabled={currentPage === 1}
            >
                <AngleDownIcon className="rotate-90 w-5 h-5" />
            </button>
            
            {Array.from({ length: buttonsNumber }, (_, i) => i + 1).map((pageNum) => {
                if (showEllipsis) {
                    if (pageNum === 2 && currentPage > 3) {
                        return <span key="start-ellipsis" className="self-center">...</span>;
                    }
                    if (pageNum === buttonsNumber - 1 && currentPage < buttonsNumber - 2) {
                        return <span key="end-ellipsis" className="self-center">...</span>;
                    }
                    if (pageNum !== 1 && pageNum !== buttonsNumber && Math.abs(pageNum - currentPage) > 1) {
                        return null;
                    }
                }

                return (
                    <button 
                        key={pageNum}
                        className={`${buttonStyle} ${pageNum === currentPage ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                    >
                        {pageNum}
                    </button>
                );
            })}

            <button 
                className={buttonStyle} 
                onClick={() => setCurrentPage(prev => prev + 1)} 
                disabled={currentPage === buttonsNumber}
            >
                <AngleDownIcon className="-rotate-90 w-5 h-5" />
            </button>
        </div>
    );
}