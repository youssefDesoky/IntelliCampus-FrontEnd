import Section from "../../ui/Section.jsx";
import PageHeader from "../../ui/PageHeader.jsx";
import BoxData from "../../ui/BoxData.jsx";

import Course from "../../components/student/courses/Course.jsx";

// Icons
import GridIcon from "../../ui/icons/GridIcon.jsx";
import ListIcon from "../../ui/icons/ListIcon.jsx";
import BookIcon from "../../ui/icons/BookIcon.jsx";

// Data
const data = [
    { 
        title: "Total Courses", 
        // value: studentsCourses.length, 
        value: 12,
        icon: <BookIcon />,
        iconStyle: "bg-blue-100 text-blue-500"
    },
    { 
        title: "Completed Courses",
        // value: studentCoursesData.filter(c => !c.inProgress).length,
        value: 9,
        icon: <BookIcon />,
        iconStyle: "bg-green-100 text-green-500"
    },
    { 
        title: "Ongoing Courses", 
        // value: studentsCourses  .filter(c => c.inProgress).length,
        value: 3,
        icon: <BookIcon />,
        iconStyle: "bg-yellow-100 text-yellow-500"
    },
    { 
        title: "Completed Credit Hours", 
        // value: studentsCourses.filter(c => !c.inProgress).reduce((sum, c) => sum + c.creditHours, 0),
        value: 54,
        icon: <BookIcon />,
        iconStyle: "bg-purple-100 text-purple-500"
    },
    { 
        title: "Ongoing Credit Hours", 
        // value: studentsCourses.filter(c => c.inProgress).reduce((sum, c) => sum + c.creditHours, 0),
        value: 15,
        icon: <BookIcon />,
        iconStyle: "bg-red-100 text-red-500"
    },
];

export default function StudentCourses({studentsCourses}) {
    return (
        <>
            <PageHeader title="My Courses" subtitle="Spring 2025 Semester">
                <div className="flex flex-row items-center gap-4 justify-between w-auto">
                    <div className="flex items-center gap-4">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                            All Courses
                        </button>
                        
                        <button className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200">
                            In Progress
                        </button>

                        <button className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200">
                            Completed
                        </button>
                    </div>

                    <div className="flex items-center">
                        <div className="flex flex-row items-center gap-1 bg-gray-50 p-1 border border-gray-200 rounded-md">
                            <button className="px-2 py-1 flex items-center gap-2 cursor-none hover:bg-gray-300 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">
                                <GridIcon className="w-5 h-5" />
                            </button>

                            <button className="px-2 py-1 flex items-center gap-2 cursor-none bg-blue-500 rounded-md text-sm font-medium text-white" test="active">
                                <ListIcon className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <select name="" id="" className="ml-4 p-2 border border-gray-300 rounded-md cursor-none" data-cursor="clickable">
                            <option value="sort-by">Sort By</option>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="date-newest">Date (Newest)</option>
                            <option value="date-oldest">Date (Oldest)</option>
                        </select>
                    </div>
                </div>
            </PageHeader>

            <Section className="grid grid-cols-5 gap-6 mb-6">
                {data.map((item, index) => (
                    <BoxData 
                        key={index} 
                        title={item.title} 
                        value={item.value} 
                        icon={item.icon}
                        iconStyle={item.iconStyle}
                    />
                ))}
            </Section>

            <Section className="mb-6">
                {studentsCourses.map((course) => (
                    <Course key={course.id} course={course} />
                ))}
            </Section>
        </>
    );
}