import PageHeader from "../../../components/ui/PageHeader";
import CircularProgress from "../../../components/ui/CircularProgress";

export default function CourseHeader({ course, isMobile }) {
    return (
        <PageHeader
            title={`${course.id}: ${course.title}`}
            subtitle={
                <div className="flex flex-row items-center gap-2">
                    {course.semester} 
                    <span className="w-1 h-1 rounded-full my-auto mx-1 bg-text-secondary-default-light dark:bg-text-secondary-default-dark" />
                    {course.professor}
                </div>
            }
        >
            <div className="flex flex-row items-center">
                {!isMobile && ( 
                    <div className="flex flex-col items-center mr-8">
                        <p>Course Progress</p>
                        <h3 className="text-xl font-bold">{course.progress}% Complete</h3>
                    </div>
                )}

                <CircularProgress size={75} progress={course.progress} strokeWidth={10} />
            </div>
        </PageHeader>                    
    );
}