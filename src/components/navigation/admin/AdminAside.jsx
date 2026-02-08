import Aside from "../base/Aside";
import { useTranslation } from "react-i18next";
import { getNavigationLinks } from "../../../data/admin/navigationLinks";


export default function AdminAside({ height }) {
    const { t } = useTranslation('admin/aside');
    
    return (
        <Aside links={getNavigationLinks(t)} height={height} />            
    );
}