import Section from "./Section";

export default function PageHeader({title, subtitle, children}) {
    return (
        <Section className="flex flex-row items-center justify-between mb-6 gap-4">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold mb-2">{title}</h1>
                <p className="text-gray-600 font-normal text-sm">{subtitle}</p>
            </div>

            {children}
        </Section>
    );
}