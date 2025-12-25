// Icons
import CalendarIcon from "../../../../components/icons/CalendarIcon";

export default function DashboardCourse({ courseData }) {
    return (
        <div type="class-item" className="mb-4 border border-default-border-light dark:border-default-border-dark rounded-lg">
            <div className="p-4 mb-4 w-full bg-blue-400 text-accent-text-light dark:text-accent-text-dark rounded-t-lg inline-block">                
                <h3 className="text-xl font-bold my-2">{courseData.title}</h3>

                <p className="text-sm text-muted-text-light dark:text-muted-text-dark">{courseData.id}</p>
            </div>

            <div className="flex items-center justify-between px-4 mb-4">
                <div className="flex items-center gap-3">
                    <img src="/images/students/youssefAhmed/profile.png" alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                        <h4 className="font-semibold">{courseData.professor}</h4>
                        <p className="text-sm text-muted-text-light dark:text-muted-text-dark">{courseData.department}</p>
                    </div>
                </div>
            </div>

            <div className="mb-4 px-4">
                <div className="flex justify-between mb-1">
                    <p>Course Progress</p>
                    <span>{courseData.progress}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`bg-blue-600 h-2.5 rounded-full`} style={{width: courseData.progress}}></div>
                </div>
            </div>

            <div className="p-4 flex justify-between border-t border-default-border-light dark:border-default-border-dark text-sm text-muted-text-light dark:text-muted-text-dark">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span>{courseData.schedule}</span>
                </div>

                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-none font-medium">Enter Classroom</button>
            </div>
        </div>
    );
}