import { useTranslation } from "react-i18next";
import { getNavigationLinks } from "../../../data/admin/navigationLinks";

import BottomBar from "../base/BottomBar";

export default function AdminBottomBar() {
    const { t } = useTranslation('admin/aside');
    
    return (
        <BottomBar links={getNavigationLinks(t)} />
    );
}