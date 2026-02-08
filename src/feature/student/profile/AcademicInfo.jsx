import InputItem from "../../../components/form/InputItem";
import Section from "../../../components/ui/Section";

export default function AcademicInfo({ user, className="" }) {
    return (
        <Section className={`rounded-2xl p-6 shadow-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark ${className}`}>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">Academic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.AcademicInformation.map((info, index) => (
                    <InputItem
                        type="text"
                        key={index}
                        name={info.name}
                        label={info.label}
                        value={info.value}
                        isDisabled={true}
                    />
                ))}
            </div>
        </Section>
    );
}