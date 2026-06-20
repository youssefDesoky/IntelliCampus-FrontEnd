export default function ChartCard({ title, icon, children, className = "", onTitleClick }) {
 return (
 <div
 className={`p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg ${className}`}
 >
 <div className="flex items-center gap-3 mb-4">
 {icon && (
 <span className="text-icon-primary-default-light dark:text-icon-primary-default-dark shrink-0">
 {icon}
 </span>
 )}
 <h3
 className={`text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark ${ onTitleClick ? "hover:text-text-accent-default-light dark:hover:text-text-accent-default-dark transition-colors" : "" }`}
 onClick={onTitleClick}
 >
 {title}
 </h3>
 </div>
 {children}
 </div>
 );
}
