import { HouseIcon, ChartLineIcon, UsersIcon, CalendarDaysIcon, UserTieIcon, UserCheckIcon, BookIcon, FileLinesIcon, DoorOpenIcon, BuildingIcon, ClipboardCheckIcon } from '../../components/ui/icons';

export const getNavigationLinks = (t) => [
    { to: "/admin", icon: HouseIcon, label: t('dashboard') },
    { to: "/admin/students", icon: UsersIcon, label: t('students') },
    { to: "/admin/instructors", icon: UserTieIcon, label: t('instructors') },
    { to: "/admin/admins", icon: UserCheckIcon, label: t('admins') },
    { to: "/admin/courses", icon: BookIcon, label: t('courses') },
    { to: "/admin/rooms", icon: DoorOpenIcon, label: t('rooms') },
    { to: "/admin/departments", icon: BuildingIcon, label: t('departments') },
    { to: "/admin/bylaws", icon: FileLinesIcon, label: t('bylaws') },
    { to: "/admin/exams", icon: ClipboardCheckIcon, label: t('exams') },
];