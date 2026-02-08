import { useState } from "react";
import Section from "../../../components/ui/Section";
import PaginationButtons from "../../../components/ui/PaginationButtons";
import SmartNote from "./SmartNote";

export default function SmartNotesBody({ notes=[], isPhone, isTablet, viewMode }) {
    const itemsPerPage = isPhone ? 6 : isTablet ? 8 : 12;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(notes.length / itemsPerPage);

    return (
        <Section>
            <div className={`grid ${isPhone ? "grid-cols-1" : isTablet ? (viewMode === 'list' ? "grid-cols-1" : "grid-cols-2") : (viewMode === 'grid-3' ? "grid-cols-3" : "grid-cols-2")} gap-6 mb-4`}>
                {notes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((note) => (
                    <SmartNote key={note.id} note={note} viewMode={viewMode} isTablet={isTablet} />
                ))}
            </div>

            <PaginationButtons buttonsNumber={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </Section>  
    );
}