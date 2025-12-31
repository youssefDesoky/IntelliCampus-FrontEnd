import Header from "../../../components/layout/Header";
import Section from "../../../components/ui/Section";
import BoxData from "../../../components/ui/BoxData";

const students = [
    { id: "2021-CS-001", name: "Alice Johnson", email: "alice.johnson@example.com", status: "Present", present: 23, absent: 2, image: "/images/alice.jpg" },
    { id: "2021-CS-002", name: "Bob Smith", email: "bob.smith@example.com", status: "Absent", present: 20, absent: 5, image: "/images/bob.jpg" },
    { id: "2021-CS-003", name: "Charlie Brown", email: "charlie.brown@example.com", status: "Present", present: 22, absent: 3, image: "/images/charlie.jpg" },
    { id: "2021-CS-004", name: "Diana Prince", email: "diana.prince@example.com", status: "Present", present: 25, absent: 0, image: "/images/diana.jpg" },
    { id: "2021-CS-005", name: "Ethan Hunt", email: "ethan.hunt@example.com", status: "Absent", present: 18, absent: 7, image: "/images/ethan.jpg" },
];
const totalAttendanceDays = 25;


const boxesData = [
    { 
        title: "Total Students",
        value: 124, 
        icon: 
            (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-6 h-6 fill-blue-600">
                    <path d="M320 80C377.4 80 424 126.6 424 184C424 241.4 377.4 288 320 288C262.6 288 216 241.4 216 184C216 126.6 262.6 80 320 80zM96 152C135.8 152 168 184.2 168 224C168 263.8 135.8 296 96 296C56.2 296 24 263.8 24 224C24 184.2 56.2 152 96 152zM0 480C0 409.3 57.3 352 128 352C140.8 352 153.2 353.9 164.9 357.4C132 394.2 112 442.8 112 496L112 512C112 523.4 114.4 534.2 118.7 544L32 544C14.3 544 0 529.7 0 512L0 480zM521.3 544C525.6 534.2 528 523.4 528 512L528 496C528 442.8 508 394.2 475.1 357.4C486.8 353.9 499.2 352 512 352C582.7 352 640 409.3 640 480L640 512C640 529.7 625.7 544 608 544L521.3 544zM472 224C472 184.2 504.2 152 544 152C583.8 152 616 184.2 616 224C616 263.8 583.8 296 544 296C504.2 296 472 263.8 472 224zM160 496C160 407.6 231.6 336 320 336C408.4 336 480 407.6 480 496L480 512C480 529.7 465.7 544 448 544L192 544C174.3 544 160 529.7 160 512L160 496z"/>
                </svg>
            ), 
        className: "bg-blue-100" 
    },
    {
        title: "Present Today",
        value: 98,
        icon:
            (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-6 h-6 fill-green-600">
                    <path d="M286 368C384.5 368 464.3 447.8 464.3 546.3C464.3 562.7 451 576 434.6 576L78 576C61.6 576 48.3 562.7 48.3 546.3C48.3 447.8 128.1 368 226.6 368L286 368zM585.7 169.9C593.5 159.2 608.5 156.8 619.2 164.6C629.9 172.4 632.3 187.4 624.5 198.1L522.1 338.9C517.9 344.6 511.4 348.3 504.4 348.7C497.4 349.1 490.4 346.5 485.5 341.4L439.1 293.4C429.9 283.9 430.1 268.7 439.7 259.5C449.2 250.3 464.4 250.6 473.6 260.1L500.1 287.5L585.7 169.8zM256.3 312C190 312 136.3 258.3 136.3 192C136.3 125.7 190 72 256.3 72C322.6 72 376.3 125.7 376.3 192C376.3 258.3 322.6 312 256.3 312z"/>
                </svg>
            ),
        className: "bg-green-100"
    },
    {
        title: "Absent Today",
        value: 26,
        icon:
            (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-6 h-6 fill-red-600">
                    <path d="M136.4 192C136.4 125.7 190.1 72 256.4 72C322.7 72 376.4 125.7 376.4 192C376.4 258.3 322.7 312 256.4 312C190.1 312 136.4 258.3 136.4 192zM48.4 546.3C48.4 447.8 128.2 368 226.7 368L286.1 368C384.6 368 464.4 447.8 464.4 546.3C464.4 562.7 451.1 576 434.7 576L78.1 576C61.7 576 48.4 562.7 48.4 546.3zM612.3 188.1C621.7 197.5 621.7 212.7 612.3 222L578.4 255.9L612.3 289.8C621.7 299.2 621.7 314.4 612.3 323.7C602.9 333 587.7 333.1 578.4 323.7L544.5 289.8L510.6 323.7C501.2 333.1 486 333.1 476.7 323.7C467.4 314.3 467.3 299.1 476.7 289.8L510.6 255.9L476.7 222C467.3 212.6 467.3 197.4 476.7 188.1C486.1 178.8 501.3 178.7 510.6 188.1L544.5 222L578.4 188.1C587.8 178.7 603 178.7 612.3 188.1z"/>
                </svg>
            ),
        className: "bg-red-100"
    },
    {
        title: "Below 75%",
        value: 18,
        icon:
            (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6 fill-yellow-600">
                    <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>
                </svg>
            ),
        className: "bg-yellow-100"
    }
]

export default function Attendance() {
    return (
        <Section className="w-[100vw] bg-gray-50">
            <Header headerTitle="Attendance Management" />

            <Section className="bg-white p-6 rounded-lg shadow-sm mb-6 flex items-end gap-4">
                <div className="flex-1">
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
                    <select name="course" id="course" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                        <option value="">CSE 101 - Introduction to Programming</option>
                        <option value="">CSE 102 - Data Structures</option>
                        <option value="">CSE 103 - Algorithms</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                    <input type="date" id="date" defaultValue="2024-01-15" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-4 h-4 fill-white">
                        <path d="M96 128C83.1 128 71.4 135.8 66.4 147.8C61.4 159.8 64.2 173.5 73.4 182.6L256 365.3L256 480C256 488.5 259.4 496.6 265.4 502.6L329.4 566.6C338.6 575.8 352.3 578.5 364.3 573.5C376.3 568.5 384 556.9 384 544L384 365.3L566.6 182.7C575.8 173.5 578.5 159.8 573.5 147.8C568.5 135.8 556.9 128 544 128L96 128z"/>
                    </svg>
                    Filter
                </button>
            </Section>

            <Section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {boxesData.map((box, index) => (
                    <BoxData title={box.title} key={index} value={box.value} icon={box.icon} className={box.className} />
                ))}
            </Section>

            <Section className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Student Attendance</h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search students..." 
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-gray-400 absolute left-3 top-1/2 -translate-y-1/2">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                            </svg>
                        </div>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-white">
                                <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>
                            </svg>
                            Mark All Present
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-white">
                                <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/>
                            </svg>
                            Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase">
                                    <input type="checkbox" className="rounded" />
                                </th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase">Student</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase">University ID</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase">Overall %</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase">Present</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase">Absent</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase">Status</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => {
                                const percentage = ((student.present / totalAttendanceDays) * 100).toFixed(0);
                                return (
                                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4">
                                            <input type="checkbox" className="rounded" />
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <img src={student.image} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{student.name}</h3>
                                                    <p className="text-sm text-gray-500">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-700">{student.id}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-semibold ${percentage >= 85 ? 'text-green-600' : percentage >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {percentage}%
                                                </span>
                                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${percentage >= 85 ? 'bg-green-500' : percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                        style={{width: `${percentage}%`}}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-700">{student.present}</td>
                                        <td className="py-4 px-4 text-gray-700">{student.absent}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit ${
                                                student.status === 'Present' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                <span className={`w-2 h-2 rounded-full ${
                                                    student.status === 'Present' ? 'bg-green-500' : 'bg-red-500'
                                                }`}></span>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-5 h-5 fill-gray-600">
                                                    <path d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Section>
        </Section>
    );
}