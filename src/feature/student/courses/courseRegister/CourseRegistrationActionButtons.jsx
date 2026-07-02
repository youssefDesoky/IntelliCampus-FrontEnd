import Button from "../../../../components/ui/Button";
import { CheckIcon } from "../../../../components/ui/icons";

export default function CoursesRegistrationActionButtons({ onConfirm }) {
    return(
        <div className="flex justify-end">
            <Button
                variant="primary"
                onClick={onConfirm}
            >
                <CheckIcon size={20} />
                Confirm Registration
            </Button>
        </div>
    );
}