import PageHeader from "../../../components/ui/PageHeader";
import Button from "../../../components/ui/Button";
import Section from "../../../components/ui/Section";
import SelectBox from "../../../components/ui/SelectBox";
import SearchBar from "../../../components/ui/SearchBar";
import ToggleViewMode from "../../../components/ui/ToggleViewMode";

// Icons
import { PlusIcon, Grid3ColIcon, Grid2ColIcon, ListIcon } from "../../../components/ui/icons";

export default function SmartNotesHeader({notes=[], isPhone, isTablet, viewMode, setViewMode}) {
    const uniqueCourses = [...new Set(notes.map(note => note.course))];

    return (
        <>
            <PageHeader title="Smart Notes" subtitle="Organize and enhance your notes with AI">
                <Button className="flex items-center gap-2 px-4 py-2 bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark rounded-md hover:scale-[1.02]">
                    <PlusIcon className="w-5 h-5" />
                    {!isPhone && <span className="font-semibold">Add New Note</span>}
                </Button>
            </PageHeader>

            <Section className="p-4 lg:p-6 mb-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark">
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
                            options={uniqueCourses.map(course => ({ label: course, value: course }))}
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