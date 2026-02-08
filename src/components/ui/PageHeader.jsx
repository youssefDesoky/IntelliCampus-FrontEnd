import Section from "./Section";

export default function PageHeader({title, subtitle, headerDir="row", children}) {
    const rowStyles = "flex-row items-center"
    const colStyles = "flex-col"
    return (
        <Section className={`flex ${headerDir === "row" ? rowStyles : colStyles} justify-between mb-6 gap-4`}>
            <div className="space-y-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-text-primary-active-light dark:text-text-primary-active-dark truncate">{title}</h1>
                <div className="text-text-secondary-active-light dark:text-text-secondary-active-dark font-normal text-xs md:text-sm truncate">{subtitle}</div>
            </div>

            {children}
        </Section>
    );
}