import Button from "../../../../components/ui/Button";
import { ClockIcon, UsersIcon } from "../../../../components/ui/icons";

export default function ClassItem({classInfo}) {
    return (
        <div type="class-item" className="mb-4 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg">
            <div className="p-4 mb-4 w-full bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark rounded-t-lg inline-block">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">10:00 AM - 11:00 AM</p>
                    <p className="text-xs px-3 py-1.5 rounded-full bg-bg-surface-accent-active-light dark:bg-bg-surface-accent-active-dark">in 30 minutes</p>
                </div>
                
                <h3 className="text-xl font-bold my-2">{classInfo.title}</h3>

                <div className="flex flex-row gap-0 text-sm text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                    <p>{classInfo.id}</p>
                    <span className="w-1 h-1 rounded-full my-auto mx-1 bg-bg-surface-secondary-hover-light dark:bg-bg-surface-secondary-hover-dark"></span>
                    <p>{classInfo.room}</p>
                </div>
            </div>

            <div className="flex items-center justify-between px-4 mb-4">
                <div className="flex items-center gap-3">
                    <img src="/images/students/youssefAhmed/profile.png" alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                        <h4 className="font-semibold">{classInfo.professor}</h4>
                        <p className="text-sm text-text-tertiary-default-light dark:text-text-tertiary-default-dark">{classInfo.department}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
                <div className="flex items-center gap-6 text-sm text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                    <div className="flex items-center gap-2">
                        <UsersIcon className="w-5 h-5" />
                        <span>{classInfo.numOfStudents} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ClockIcon className="w-5 h-5" />
                        <span>90 mins</span>
                    </div>
                </div>

                <Button className="px-4 py-2 bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark rounded-lg">Set Reminder</Button>
            </div>
        </div>
    );
}