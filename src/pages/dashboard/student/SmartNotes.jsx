import { useState } from "react";

import useDeviceType from "../../../hooks/useDeviceType";

import SmartNotesBody from "../../../feature/student/smartNotes/SmartNotesBody";
import SmartNotesHeader from "../../../feature/student/smartNotes/SmartNotesHeader";


export default function SmartNotes() {
    const {isPhone, isTablet} = useDeviceType();
    const [viewMode, setViewMode] = useState(
        localStorage.getItem('notesViewMode') === 'grid-3' ? 'grid-3' : 'grid-2'
    );
    return (
        <>
            <SmartNotesHeader notes={notes} isPhone={isPhone} isTablet={isTablet} viewMode={viewMode} setViewMode={setViewMode} />
            
            <SmartNotesBody notes={notes} isPhone={isPhone} isTablet={isTablet} viewMode={viewMode} />
        </>
    );
}


const notes = [
    {
        id: 1,
        title: "Note 1",
        content: "This is the content of note 1.",
        course: "Course A",
        date: "2024-06-01"
    },
    {
        id: 2,
        title: "Note 2",
        content: "This is the content of note 2.",
        course: "Course B",
        date: "2024-06-02"
    },
    {
        id: 3,
        title: "Note 3",
        content: "This is the content of note 3.",
        course: "Course C",
        date: "2024-06-03"
    },
    {
        id: 4,
        title: "Note 4",
        content: "This is the content of note 4.",
        course: "Course D",
        date: "2024-06-04"
    },
    {
        id: 5,
        title: "Note 5",
        content: "This is the content of note 5.",
        course: "Course E",
        date: "2024-06-05"
    },
    {
        id: 6,
        title: "Note 6",
        content: "This is the content of note 6.",
        course: "Course F",
        date: "2024-06-06"
    }
]