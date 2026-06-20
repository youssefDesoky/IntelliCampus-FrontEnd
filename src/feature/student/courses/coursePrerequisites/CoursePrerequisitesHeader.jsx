    import PageHeader from "../../../../components/ui/PageHeader";
    import SearchBar from "../../../../components/ui/SearchBar";

    export default function CoursePrerequisitesHeader({ isMobile, search, onSearchChange }) {
        return (
            <PageHeader
                title="Course Prerequisites"
                subtitle="Review the prerequisites for your courses and plan your academic path."
                headerDir={isMobile ? "col" : "row"}
            >
                <SearchBar placeholder="Search by course code or title..." value={search} onChange={(e) => onSearchChange(e.target.value)} />
            </PageHeader>
        );
    }
