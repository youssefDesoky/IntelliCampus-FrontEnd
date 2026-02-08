import Section from "../../../components/ui/Section";
import SpanRounded from "../../../components/ui/SpanRounded";

const categories = [
    { label: "Classes", value: 12 },
    { label: "Exams", value: 14 },
    { label: "Assignments", value: 6 },
    { label: "Personal", value: 8},
]

export default function Categories() {
    return (
        <Section>
            <h2>Categories</h2>
            <div>
                {categories.map((category, index) => (
                    <div key={index}>
                        <SpanRounded />
                        <h3>{category.label}</h3>
                        <p>{category.value}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
}