import { Link } from 'react-router-dom';

import Button from '../../../ui/Button';
import ProgressBox from '../../../ui/ProgressBox';

// Icons
import {BellIconLight, EllipsisVerticalIcon, UserTieIcon, CalendarIcon, LocationDotIcon, CheckIcon, XIcon, ExclamationIcon, StarIcon, FileLinesIcon} from '../../../ui/icons';

const palette = [
  "#2563EB", // blue-600
  "#16A34A", // green-600
  "#D97706", // amber-600 (yellow-ish)
  "#7C3AED", // purple-600
  "#DC2626", // red-600
  "#0EA5A4", // teal-500
  "#F97316", // orange-500
  "#059669", // emerald-600
  "#0F172A", // slate-900
  "#6B7280"  // gray-500
];

function hashToIndex(str, max) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return Math.abs(h) % max;
}

function hexToRgba(hex, alpha = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c+ c).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getDepartmentColor(department) {
  if (!department) {
    const idx = hashToIndex("default", palette.length);
    const hex = palette[idx];
    return { hex, light: hexToRgba(hex, 0.12) };
  }
  const idx = hashToIndex(department.toLowerCase(), palette.length);
  const hex = palette[idx];
  return { hex, light: hexToRgba(hex, 0.12) };
}

export default function Course({course}) {
    const { hex: deptColor, light: deptLight } = getDepartmentColor(course.department);

    return(
        <div className={`bg-white grid grid-cols-5 gap-4 border-l-8 rounded-lg p-6 mb-4 shadow-sm relative hover:shadow-lg transition-shadow duration-200 ease-in-out`} style={{ borderLeftColor: deptColor }}>
            <div className="mb-4 col-span-4">
                <div className="flex gap-3 items-center mb-2">
                    <span className={`px-2 py-1 rounded-full border text-xs font-semibold`}  style={{backgroundColor: deptLight, color: deptColor, borderColor: deptColor}}>{course.id}</span>
                    <span className="text-gray-600 text-xs font-normal">{course.semester}</span>
                </div>

                <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                
                <div className="flex flex-row gap-6 text-sm text-gray-600 mb-4">
                    <div>
                        <UserTieIcon className="w-5 h-5 inline-block mr-1" />
                        <span>{course.professor}</span>
                    </div>
                    
                    <div>
                        <CalendarIcon className="w-5 h-5 inline-block mr-1" />
                        <span>{course.schedule}</span>
                    </div>

                    <div>
                        <LocationDotIcon className="w-5 h-5 inline-block mr-1" />
                        <span>{course.room}</span>
                    </div>
                </div>

                <ProgressBox progress={course.progress} >
                    <p>Course Progress</p>
                    <span>{course.progress}</span>
                </ProgressBox>

                <div className={`flex flex-row gap-4 text-sm text-gray-700 mb-4`}>
                    <div className="flex items-center">
                        <div className={`p-2 rounded-md mr-2 flex items-center justify-center bg-${course.attendance > 75 ? 'green' : course.attendance >= 50 ? 'yellow' : 'red'}-100`}>
                            {course.attendance > 75 ? <CheckIcon className="w-5 h-5 inline-block" /> : course.attendance >= 50 ? <ExclamationIcon className="w-5 h-5 inline-block" /> : <XIcon className="w-5 h-5 inline-block" />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-normal text-gray-600">Attendance</span>
                            <span className="text-sm font-semibold">{course.attendance}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-md mr-2 flex items-center justify-center">
                            <FileLinesIcon className="w-5 h-5 inline-block" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-normal text-gray-600">Assignments</span>
                            <span className="text-sm font-semibold">
                                {course.assignments.filter(a => a.status === "Submitted").length}
                                /
                                {course.assignments.length}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-md mr-2 flex items-center justify-center">
                            <StarIcon className="w-5 h-5 inline-block" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-normal text-gray-600">Grade</span>
                            <span className="text-sm font-semibold">{course.grade}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-span-1 flex flex-col gap-4 items-end">
                <Link 
                    to={`/courses/${course.id}`}
                    className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-md border border-blue-600"
                >
                    Enter Classroom
                </Link>

                <Link 
                    to={`/courses/${course.id}/materials`}
                    className="bg-white text-gray-600 text-sm font-medium px-4 py-2 rounded-md border border-gray-300"
                >
                    View Materials
                </Link>

                <div className="flex flex-row gap-2">
                    <Button className="border border-gray-300 p-2 rounded-md">
                        <BellIconLight className="w-5 h-5" />
                    </Button>
                    <Button className="border border-gray-300 p-2 rounded-md">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}