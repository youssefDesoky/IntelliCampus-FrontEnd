import Section from "../../../components/ui/Section";
import Button from "../../../components/ui/Button";
import { QRCodeIcon } from "../../../components/ui/icons";

export default function ProfileOverview({ user, setIsProfileOverviewVisible, className="" }) {
    return (
        <Section className={`relative rounded-2xl p-6 shadow-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark ${className}`}>
            <button
                onClick={() => setIsProfileOverviewVisible(false)}
                className="absolute top-6 right-6 p-2 rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark hover:bg-bg-surface-secondary-hover-light dark:hover:bg-bg-surface-secondary-hover-dark"
            >
                <QRCodeIcon size={24} />
            </button>

            <div className="flex flex-row items-end gap-4 mb-8">
                <div className="w-32 h-32 rounded-lg p-1 bg-linear-to-tr from-border-accent-default-light to-border-accent-disabled-dark">
                    <div className="w-full h-full rounded-lg overflow-hidden">
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-1">{user.name}</h2>
                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        {user.specialization}
                    </p>
                </div>
            </div>

            <div className="flex flex-row items-center justify-around mb-8">
                <div className="px-2 w-full border-r border-border-primary-default-light dark:border-border-primary-default-dark text-center">
                    <div className="text-2xl font-bold">{user.gpa}</div>
                    <div className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark uppercase font-medium">GPA</div>
                </div>

                <div className="px-2 w-full text-center">
                    <div className="text-2xl font-bold">{user.attendance}</div>
                    <div className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark uppercase font-medium">Attendance</div>
                </div>
            </div>

            <Button 
                variant="primary"
                width="w-full"    
            >
                Edit Profile
            </Button>
        </Section>
    );
}