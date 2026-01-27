import PageHeader from "../../../../ui/PageHeader";
import SearchBar from "../../../../ui/SearchBar";

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