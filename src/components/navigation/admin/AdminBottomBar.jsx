import { useMemo } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getNavigationLinks } from "../../../data/admin/navigationLinks";
import BottomBar from "../base/BottomBar";

export default function AdminBottomBar() {
    const { t } = useTranslation('admin/aside');
    const user = useRouteLoaderData("root");
    const userRoles = useMemo(() => (user?.roles || []).map(r => r.toLowerCase()), [user]);

    const links = useMemo(() =>
        getNavigationLinks(t).filter(link =>
            link.roles.some(r => userRoles.includes(r))
        ),
        [t, userRoles]
    );

    return (
        <BottomBar links={links} />
    );
}
