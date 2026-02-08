import { useState } from "react";
import PageHeader from "./PageHeader";
import Button from "./Button";
import ImportDialog from "./ImportDialog";
import { ImportIcon, PlusIcon } from "./icons";

const roleLabels = {
    student: { plural: "Students", singular: "Student" },
    instructor: { plural: "Instructors", singular: "Instructor" },
    admin: { plural: "Admins", singular: "Admin" },
};

export default function UserHeader({ role, setIsUserFormOpen }) {
    const [isImportOpen, setIsImportOpen] = useState(false);
    const labels = roleLabels[role] || roleLabels.student;

    const handleImport = (file) => {
        console.log(`Importing ${labels.plural} from:`, file.name);
        setIsImportOpen(false);
    };

    return (
        <>
            <PageHeader title={`Manage ${labels.plural}`} subtitle={`Administer ${labels.singular.toLowerCase()} records and information`} >
                <div className="flex items-center gap-2">
                    <Button 
                        variant="secondary"
                        onClick={() => setIsImportOpen(true)}
                    >
                        <ImportIcon size={24} />
                        Import {labels.plural}
                    </Button>
                    
                    <Button 
                        variant="primary"
                        onClick={() => setIsUserFormOpen(true)}
                    >
                        <PlusIcon size={24} />
                        Add {labels.singular}
                    </Button>
                </div>
            </PageHeader>

            {isImportOpen && (
                <ImportDialog
                    title={`Import ${labels.plural}`}
                    subtitle={`Upload a file to bulk-import ${labels.singular.toLowerCase()} records.`}
                    onClose={() => setIsImportOpen(false)}
                    onImport={handleImport}
                />
            )}
        </>
    );
}