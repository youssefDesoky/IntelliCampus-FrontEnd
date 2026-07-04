import { useTranslation } from 'react-i18next';
import Button from "../../../../components/ui/Button";
import { CheckIcon, FloppyDiskIcon } from "../../../../components/ui/icons";

export default function CoursesRegistrationActionButtons({ onConfirm }) {
    const { t } = useTranslation('student');
    return(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
                variant="secondary"
                width="w-full"
            >
                <FloppyDiskIcon size={20} />
                {t('registration.saveDraft')}
            </Button>
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