import { useTranslation } from 'react-i18next';
import Button from "../../../../components/ui/Button";
import { CheckIcon } from "../../../../components/ui/icons";

export default function CoursesRegistrationActionButtons({ onConfirm }) {
    const { t } = useTranslation('student');
    return(
        <div className="flex justify-end">
            <Button
                variant="primary"
                onClick={onConfirm}
            >
                <CheckIcon size={20} />
                {t('registration.confirm')}
            </Button>
        </div>
    );
}