export default function ModelOverlay({ children, onClose, maxWidth = "max-w-5xl" }) {
    return (
        <div className="fixed inset-0 z-50 flex sm:items-center items-start justify-center pt-8 sm:pt-0 p-4">
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            <div className={`relative z-10 w-full ${maxWidth} flex justify-center`}>
                {children}
            </div>
        </div>
    );
}
