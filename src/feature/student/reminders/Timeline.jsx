import Section from "../../../components/ui/Section";
import SelectBox from "../../../components/ui/SelectBox";

export default function Timeline({ className }) {
    return (
        <Section className={`${className}`}>
            <div>
                <h2>Timeline</h2>

                <SelectBox
                    options={[
                        { value: 'all', label: 'All Categories' },
                        { value: 'classes', label: 'Classes' },
                        { value: 'exams', label: 'Exams' },
                        { value: 'assignments', label: 'Assignments' },
                        { value: 'personal', label: 'Personal' }
                    ]}
                    defaultValue="all"
                />
            </div>

            <div>
                <div>
                    <div>
                        <span className="w-2 h-2 bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark rounded-full"></span>
                        <p>Today</p>
                        <div className="h-px"/>
                    </div>
                    <div>
                        <div>
                            <h3>Data structures</h3>
                            <p>3:00 PM</p>
                            <span></span>
                            <p>Room 204</p> {/* or add course id in case of assignment */}
                        </div>
                        <button>
                            
                        </button>
                    </div>
                </div>
            </div>
        </Section>
    );
}