import Button from "../../../../components/ui/Button";
import { CalendarIcon } from "../../../../components/ui/icons";

export default function DashboardCourse({ courseData }) {
    return (
        <div type="class-item" className="mb-4 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg">
            <div className="p-4 mb-4 w-full bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark rounded-t-lg inline-block">                
                <h3 className="text-xl font-bold my-2">{courseData.title}</h3>

                <p className="text-sm text-text-tertiary-default-light dark:text-text-tertiary-default-dark">{courseData.id}</p>
            </div>

            <div className="flex items-center justify-between px-4 mb-4">
                <div className="flex items-center gap-3">
                    <img src="/images/students/youssefAhmed/profile.png" alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                        <h4 className="font-semibold">{courseData.professor}</h4>
                        <p className="text-sm text-text-tertiary-default-light dark:text-text-tertiary-default-dark">{courseData.department}</p>
                    </div>
                </div>
            </div>

            <div className="mb-4 px-4">
                <div className="flex justify-between mb-1">
                    <p>Course Progress</p>
                    <span>{courseData.progress}</span>
                </div>
                <div className="w-full bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-full h-2.5">
                    <div className={`bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark h-2.5 rounded-full`} style={{width: courseData.progress}}></div>
                </div>
            </div>

            <div className="p-4 flex justify-between border-t border-border-primary-default-light dark:border-border-primary-default-dark text-sm text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span>{courseData.schedule}</span>
                </div>

                <Button className="px-4 py-2 bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark rounded-lg font-medium">Enter Classroom</Button>
            </div>
        </div>
    );
}