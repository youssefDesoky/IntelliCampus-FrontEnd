export default function ProgressBox({progress, backgroundColor="bg-accent-light dark:bg-accent-dark", children}) {
    return (
        <div className="mb-4">
            <div className="flex justify-between mb-1">
                {children}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${backgroundColor}`} style={{width: `${progress}%`}}></div>
            </div>
        </div>
    );
}