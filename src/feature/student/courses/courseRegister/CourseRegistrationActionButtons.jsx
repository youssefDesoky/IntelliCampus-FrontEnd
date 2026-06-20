import Button from "../../../../components/ui/Button";
import { FloppyDiskIcon, CheckIcon } from "../../../../components/ui/icons";

export default function CoursesRegistrationActionButtons({ onConfirm }) {
    return(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
                variant="secondary"
                width="w-full"
            >
                <FloppyDiskIcon size={20} />
                Save Draft
            </Button>

            <Button
                variant="primary"
                width="w-full"
                onClick={onConfirm}
            >
                <CheckIcon size={20} />
                Confirm Registration
            </Button>
        </div>
    );
}