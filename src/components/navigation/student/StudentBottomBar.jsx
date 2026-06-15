import { useTranslation } from 'react-i18next';
import { getNavigationLinks } from '../../../data/student/navigationLinks';

import BottomBar from '../base/BottomBar';
import { BookIcon } from '../../ui/icons';


export default function StudentBottomBar() {
    const { t } = useTranslation('student/aside');
    const allLinks = getNavigationLinks(t);

    const links = [
        ...allLinks,
        { to: '/courses', icon: BookIcon, label: t('allCourses') },
    ];

    return (
        <BottomBar links={links} />
    );
}