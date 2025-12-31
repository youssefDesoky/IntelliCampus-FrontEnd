import PageHeader from "../../../ui/PageHeader";
import Button from "../../../ui/Button";
import Section from "../../../ui/Section";
import Input from "../../../ui/Input";
import Label from "../../../ui/Label";

// Icons
import { PlusIcon, ListIcon, GridIcon } from "../../../ui/icons";
import ToggleViewMode from "../../../ui/ToggleViewMode";

export default function SmartNotesHeader({title, subtitle, notes}) {
    const uniqueCourses = [...new Set(notes.map(note => note.course))];
    const uniqueTags = [...new Set(notes.flatMap(note => note.tags))];

    return (
        <>
            <PageHeader title={title} subtitle={subtitle}>
                <Button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:scale-[1.02] transition-transform duration-200 ease-in-out cursor-none">
                    <PlusIcon className="w-5 h-5" />
                    <span className="font-semibold">Add New Note</span>
                </Button>
            </PageHeader>

            <Section className="p-6 mb-6 bg-surface-bg-light dark:bg-surface-bg-dark rounded border border-default-border-light dark:border-default-border-dark">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Input type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="Search notes..." />

                        <select name="" id="">
                            <option value="">All Courses</option>
                            {uniqueCourses.map((course) => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                        </select>

                        <select name="" id="">
                            <option value="">All Tags</option>
                            {uniqueTags.map((tag, index) => (
                                <option key={index} value={tag}>{tag}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-around gap-4">
                        <div>
                            <Label htmlFor="sort">Sort By:</Label>
                            <select name="" id="">
                                <option value="">Recent</option>
                                <option value="">Title A-Z</option>
                                <option value="">Course</option>
                                <option value="">Creation Date</option>
                            </select>
                        </div>

                        <ToggleViewMode
                            id="notes-view-mode-toggle"
                            isVertical={false}
                            firstMode={true}
                            secondMode={false}
                            onFirstModeSelect={() => {}}
                            onSecondModeSelect={() => {}}
                            firstModeLabel={<GridIcon className="w-5 h-5" />}
                            secondModeLabel={<ListIcon className="w-5 h-5" />}
                        />
                    </div>
                </div>
            </Section>
        </>
    );
}