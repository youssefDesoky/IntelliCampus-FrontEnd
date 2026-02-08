import Button from "../../../../components/ui/Button";
import { FloppyDiskIcon, CheckIcon } from "../../../../components/ui/icons";

export default function CoursesRegistrationActionButtons() {
    return(
        <div className="flex justify-between gap-4">
            <Button 
                variant="secondary"
                width="w-full"
            >
                <FloppyDiskIcon className="w-5 h-5" />
                Save Draft
            </Button>

            <Button
                variant="primary"
                width="w-full"
            >
                <CheckIcon className="w-5 h-5" />
                Confirm Registration
            </Button>
        </div>
    );
}