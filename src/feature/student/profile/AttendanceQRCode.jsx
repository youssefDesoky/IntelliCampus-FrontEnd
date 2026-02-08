import Section from "../../../components/ui/Section";
import { UserIcon } from "../../../components/ui/icons";

export default function AttendanceQRCode({ user, setIsProfileOverviewVisible, className="" }) {
    return (
        <Section className={`relative rounded-2xl p-6 shadow-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark ${className}`}>
            <button
                onClick={() => setIsProfileOverviewVisible(true)} 
                className="absolute top-6 right-6 p-2 rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark hover:bg-bg-surface-secondary-hover-light dark:hover:bg-bg-surface-secondary-hover-dark"
            >
                <UserIcon size={24} />
            </button>
            
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">Attendance QR Code</h2>

            <div className="w-48 h-48 mx-auto mb-6">
                <img src={user.qrCode} alt="Attendance QR Code" className="w-full h-full object-cover" />
            </div>

            <p className="text-center text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">Attendance QR Code Refreshes Every 30 seconds</p>
        </Section>
    );
}