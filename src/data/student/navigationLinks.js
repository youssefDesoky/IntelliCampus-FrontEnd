import { HouseIcon, BellIconDark, StickyNoteIcon, CalendarDaysIcon } from '../../components/ui/icons';

export const getNavigationLinks = (t) => [
    { to: "/", icon: HouseIcon, label: t('dashboard') },
    { to: "/reminders", icon: BellIconDark, label: t('reminders') },
    { to: "/smart-notes", icon: StickyNoteIcon, label: t('smartNotes') },
    { to: "/schedule", icon: CalendarDaysIcon, label: t('schedule') },
];