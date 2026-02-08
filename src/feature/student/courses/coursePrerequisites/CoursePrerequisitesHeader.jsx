import PageHeader from "../../../../components/ui/PageHeader";
import SearchBar from "../../../../components/ui/SearchBar";

export default function CoursePrerequisitesHeader({ isMobile }) {
    return (
        <PageHeader
            title="Course Prerequisites"
            subtitle="Review the prerequisites for your selected courses"
            headerDir={isMobile ? "col" : "row"}
        >
            <SearchBar placeholder="Search prerequisites..." />
        </PageHeader>
    );
}