import { useTranslation } from "react-i18next";
import { getNavigationLinks } from "../../../data/instructor/navigationLinks";

import BottomBar from "../base/BottomBar";

export default function InstructorBottomBar() {
    const { t } = useTranslation('instructor/aside');
    
    return (
        <BottomBar links={getNavigationLinks(t)} />
    );
}