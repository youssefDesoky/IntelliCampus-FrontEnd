import { HouseIcon, BellIconDark, CalendarDaysIcon, BookIcon, ChartLineIcon } from '../../components/ui/icons';

export const getNavigationLinks = (t) => [
    { to: "/instructor", icon: HouseIcon, label: t('dashboard') },
    { to: "/instructor/courses", icon: BookIcon, label: t('courses') },
];