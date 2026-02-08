import { HouseIcon, ChartLineIcon, UsersIcon, CalendarDaysIcon, UserTieIcon, BookIcon } from '../../components/ui/icons';

export const getNavigationLinks = (t) => [
    { to: "/admin", icon: HouseIcon, label: t('dashboard') },
    { to: "/admin/students", icon: UsersIcon, label: t('students') },
    { to: "/admin/instructors", icon: UserTieIcon, label: t('instructors') },
    { to: "/admin/admins", icon: BookIcon, label: t('admins') },
    { to: "/admin/courses", icon: BookIcon, label: t('courses') },
    { to: "/admin/rooms", icon: CalendarDaysIcon, label: t('rooms') },
    { to: "/admin/departments", icon: UsersIcon, label: t('departments') },
];