import Section from "../../../ui/Section";
import studentsData from "../../../data/students";

export default function CommunityTopContributes(){

    return(
        <Section className="p-4 border bg-surface-bg-light dark:bg-surface-bg-dark border-default-border-light dark:border-default-border-dark rounded-md">
            <h2 className="mb-4 text-lg font-bold">Top Contributors</h2>
            <menu className="flex flex-col gap-4">
                {studentsData.map((student, index) => (
                    ((index < 4) && (
                        <li key={index} className="flex items-center gap-4 mb-4">
                            <img src={student.profileImage} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <h3 className="text-md font-medium">{student.name}</h3>
                                <p className="text-sm text-gray-500">GPA: {student.gpa} • Rank: {student.rank}</p>
                            </div>
                        </li>
                    ))
                ))}
            </menu>
        </Section>
    );
}