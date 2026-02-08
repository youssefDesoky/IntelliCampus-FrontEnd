import Section from "../../../../../components/ui/Section";

const studentsData = [
    {
        name: "Alice Johnson",
        profileImage: "/images/students/alice.jpg",
        gpa: 3.9,
        rank: 1
    },
    {
        name: "Bob Smith",
        profileImage: "/images/students/bob.jpg",
        gpa: 3.8,
        rank: 2
    },
    {
        name: "Charlie Brown",
        profileImage: "/images/students/charlie.jpg",
        gpa: 3.7,
        rank: 3
    },
    {
        name: "Diana Prince",
        profileImage: "/images/students/diana.jpg",
        gpa: 3.6,
        rank: 4
    },
    {
        name: "Eve Martinez",
        profileImage: "/images/students/eve.jpg",
        gpa: 3.5,
        rank: 5
    }
];

export default function CommunityTopContributes(){

    return(
        <Section className="p-4 border bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border-border-primary-default-light dark:border-border-primary-default-dark rounded-md">
            <h2 className="mb-4 text-lg font-bold">Top Contributors</h2>
            <menu className="flex flex-col gap-4">
                {studentsData.map((student, index) => (
                    ((index < 4) && (
                        <li key={index} className="flex items-center gap-4 mb-4">
                            <img src={student.profileImage} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <h3 className="text-md font-medium">{student.name}</h3>
                                <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">GPA: {student.gpa} • Rank: {student.rank}</p>
                            </div>
                        </li>
                    ))
                ))}
            </menu>
        </Section>
    );
}