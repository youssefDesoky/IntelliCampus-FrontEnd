import { HouseIcon, BellIconDark, CalendarDaysIcon } from '../../components/ui/icons';

export const getNavigationLinks = (t) => [
    { to: "/", icon: HouseIcon, label: t('dashboard') },
    { to: "/reminders", icon: BellIconDark, label: t('reminders') },
    { to: "/schedule", icon: CalendarDaysIcon, label: t('schedule') },
];