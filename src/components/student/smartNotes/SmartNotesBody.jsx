import Section from "../../../ui/Section";
import SmartNote from "./smartNotesBody/SmartNote";
import PaginationButtons from "../../../ui/PaginationButtons";

export default function SmartNotesBody({ notes }) {
    return (
        <Section className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                    <SmartNote key={note.id} note={note} />
                ))}
            </div>

            <PaginationButtons buttonsNumber={5} />
        </Section>  
    );
}