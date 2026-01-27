export default function AcademicInformation({ studentData }) {
    const studentDataArray = [
        { label: "Student ID", value: studentData.studentId },
        { label: "Faculty", value: studentData.faculty },
        { label: "Specialization", value: studentData.specialization },
        { label: "Year", value: studentData.year },
        { label: "Email", value: studentData.email },
        { label: "Phone", value: studentData.phone },
    ];

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Academic Information</h2>
            <div className="rounded-lg p-4 grid grid-cols-2 gap-4">
                {studentDataArray.map((data, idx) => (
                    <div key={idx} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">{data.label}</label>
                        <input
                            type="text"
                            value={data.value}
                            readOnly={true}
                            className="mt-1 block w-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-100 rounded-md"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}