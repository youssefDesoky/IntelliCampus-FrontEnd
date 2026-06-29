import TranscriptView from "../../../feature/student/courses/myCourses/TranscriptView";
import PageHeader from "../../../components/ui/PageHeader";

export default function TranscriptPage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-160px)]">
            <PageHeader title="Academic Transcript" subtitle="Your complete academic record" />
            <TranscriptView />
        </div>
    );
}
