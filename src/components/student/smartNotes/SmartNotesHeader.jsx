import PageHeader from "../../../ui/PageHeader";
import Button from "../../../ui/Button";
import Section from "../../../ui/Section";
import SelectBox from "../../../ui/SelectBox";
import SearchBar from "../../../ui/SearchBar";

// Icons
import { PlusIcon, Grid3ColIcon, Grid2ColIcon, ListIcon } from "../../../ui/icons";
import ToggleViewMode from "../../../ui/ToggleViewMode";

export default function SmartNotesHeader({notes, isPhone, isTablet, viewMode, setViewMode}) {
    const uniqueCourses = [...new Set(notes.map(note => note.course))];

    return (
        <>
            <PageHeader title="Smart Notes" subtitle="Organize and enhance your notes with AI">
                <Button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:scale-[1.02]">
                    <PlusIcon className="w-5 h-5" />
                    {!isPhone && <span className="font-semibold">Add New Note</span>}
                </Button>
            </PageHeader>

            <Section className="p-4 lg:p-6 mb-6 bg-surface-bg-light dark:bg-surface-bg-dark rounded-xl border border-default-border-light dark:border-default-border-dark">
                <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                    {/* Search Bar - Full width on all screens */}
                    <div className="w-full lg:w-fit flex items-center justify-between gap-4">
                        <SearchBar placeholder="Search notes..." />

                        {!isPhone && (
                            <div className="flex items-center">
                                <ToggleViewMode
                                    id="notes-view-mode-toggle"
                                    isVertical={false}
                                    isFirstMode={viewMode === (isTablet ? 'list' : 'grid-3')}
                                    onFirstModeSelect={() => {
                                        const mode = isTablet ? 'list' : 'grid-3';
                                        setViewMode(mode);
                                        localStorage.setItem('notesViewMode', mode);
                                    }}
                                    onSecondModeSelect={() => {
                                        setViewMode('grid-2');
                                        localStorage.setItem('notesViewMode', 'grid-2');
                                    }}
                                    firstModeLabel={isTablet ? <ListIcon className="w-5 h-5" /> : <Grid3ColIcon className="w-5 h-5" />}
                                    secondModeLabel={<Grid2ColIcon className="w-5 h-5" />}
                                />
                            </div>
                        )}
                    </div>

                    {/* Filter & Sort Group */}
                    <div className={`flex ${isPhone ? 'flex-col w-full' : 'flex-row justify-between'} gap-3`}>
                        <SelectBox
                            options={uniqueCourses.map(course => ({ label: course.title, value: course.id }))}
                            label="Filter"
                            className={isPhone ? 'w-full' : ''}
                        />

                        <SelectBox
                            label="Sort"
                            options={[
                                { label: 'Date', value: 'date' },
                                { label: 'Title', value: 'title' },
                                { label: 'Course', value: 'course' },
                            ]}
                            className={isPhone ? 'w-full' : ''}
                        />
                    </div>
                </div>
            </Section>
        </>
    );
}