import Section from "../../../../../components/ui/Section";
import Button from "../../../../../components/ui/Button";
import { CheckIcon, DownloadIcon, XIcon } from "../../../../../components/ui/icons";
import Table from "../../../../../components/ui/Table";
import AttendanceOverall from "./AttendanceOverall";
import AttendanceBreakdown from "./AttendanceBreakdown";
import AttendanceExcuseCard from "./AttendanceExcuseCard";


export default function CourseAttendance() {
    // Example layout of the expected backend response:
    const mockExpectedBackendResponse = {
        summary: {
            percentage: 85,
            attendedSessions: 21,
            missedSessions: 4,
            totalSessions: 25,
        },
        breakdown: {
            percentage: 85,
            presentSessions: 21,
            missedSessions: 4,
            totalSessions: 25,
            onTimePercentage: 80,
            needsImprovementPercentage: 20
        },
        history: sampleTableData // usually this array goes here
    };

    return (
        <>
            <Section className="mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <AttendanceOverall attendance={mockExpectedBackendResponse.summary} />
                    <AttendanceBreakdown breakdown={mockExpectedBackendResponse.breakdown} />
                    <AttendanceExcuseCard />
                </div>
            </Section>

            <Section>
                <Table
                    title="Attendance History"
                    description="Complete record of your class attendance"
                    componentButton={<Button variant="secondary" startIcon={<DownloadIcon size={18} />}>Export</Button>}
                    headers={["Date", "Time", "Session Topic", "Type", "Status"]}
                    data={sampleTableData.map((session) => ({
                        date: <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{session.date}</span>,
                        time: <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{session.time}</span>,
                        topic: <span className="text-sm text-text-primary-light dark:text-text-primary-dark">{session.topic}</span>,
                        type: (
                            <span className="inline-flex items-center rounded bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark px-2 py-0.5 text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                                {session.type}
                            </span>
                        ),
                        status: session.status === "Present" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-surface-success-default-light dark:bg-bg-surface-success-default-dark px-3 py-1 text-sm font-medium text-text-success-active-light dark:text-text-success-active-dark">
                                <CheckIcon size={14} />
                                Present
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-surface-danger-default-light dark:bg-bg-surface-danger-default-dark px-3 py-1 text-sm font-medium text-text-danger-active-light dark:text-text-danger-active-dark">
                                <XIcon size={14} />
                                Absent
                            </span>
                        ),
                    }))}
                    wrapInSection={false}
                    showHeaderActions={false}
                    showPagination={true}
                    displayRowLimit={10}
                    showSelectionColumn={false}
                    showActionsColumn={false}
                    grouped={true}
                />
            </Section>
        </>
    );
}

const sampleTableData = [
    {
        date: "24 Sep 2024",
        time: "10:00 AM - 11:30 AM",
        topic: "Introduction to React",
        type: "Lecture",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM - 11:30 AM",
        topic: "Introduction to React",
        type: "Section",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM - 11:30 AM",
        topic: "Introduction to React",
        type: "Lecture",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM - 11:30 AM",
        topic: "Introduction to React",
        type: "Section",
        status: "Absent"
    },
        {
        date: "24 Sep 2024",
        time: "10:00 AM - 11:30 AM",
        topic: "Introduction to React",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM - 11:30 AM",
        topic: "Introduction to React",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM - 11:30 AM",
        topic: "Introduction to React",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM - 11:30 AM",
        topic: "Introduction to React",
        status: "Absent"
    },
        {
        date: "24 Sep 2024",
        time: "10:00 AM - 11:30 AM",
        topic: "Introduction to React",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM - 11:30 AM",
        topic: "Introduction to React",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM - 11:30 AM",
        topic: "Introduction to React",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM - 11:30 AM",
        topic: "Introduction to React",
        status: "Absent"
    }
]