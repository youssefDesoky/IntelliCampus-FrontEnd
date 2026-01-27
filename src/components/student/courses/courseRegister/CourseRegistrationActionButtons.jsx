import Button from "../../../../ui/Button";
import { FloppyDiskIcon, CheckIcon } from "../../../../ui/icons";

export default function CoursesRegistrationActionButtons() {
    return(
        <div className="flex justify-between gap-4">
            <Button buttonType="secondary">
                <FloppyDiskIcon className="w-5 h-5" />
                Save Draft
            </Button>

            <Button>
                <CheckIcon className="w-5 h-5" />
                Confirm Registration
            </Button>
        </div>
    );
}