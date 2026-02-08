export default function BoxData({ icon, title, value, iconStyle="", ...props }) {
    return (
        <div className="p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg shadow border border-border-primary-default-light dark:border-border-primary-default-dark" {...props}>
            <div className={`w-12 h-12 p-3 rounded-md ${iconStyle} flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <p className="font-[14px] text-text-secondary-default-light dark:text-text-secondary-default-dark">{title}</p>
            <h2 className="font-[30px] text-text-primary-active-light dark:text-text-primary-active-dark">{value}</h2>
        </div>
    );
}