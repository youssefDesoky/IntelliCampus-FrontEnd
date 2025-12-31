import { useOutletContext } from "react-router-dom";

import Section from "../../../../ui/Section";

import CourseWeekMaterials from "./courseMaterials/CourseWeekMaterials";



export default function CourseMaterials() {
    const { course } = useOutletContext();

    return (
        <Section className="mt-6 bg-page-bg-light dark:bg-page-bg-dark p-6 rounded-lg shadow-md">
            {course.weeks.map((weekData, index) => (
                <CourseWeekMaterials 
                    key={index}
                    weekData={weekData}
                />
            ))}
        </Section>
    );
}