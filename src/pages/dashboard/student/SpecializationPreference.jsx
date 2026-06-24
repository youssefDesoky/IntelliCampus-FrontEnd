import { useTranslation } from "react-i18next";
import PageHeader from "../../../components/ui/PageHeader";

export default function SpecializationPreference() {
    const { t } = useTranslation("student/aside");

    return (
        <PageHeader
            title={t("specializationPreference")}
            subtitle="Rank and order your preferred departments/specializations here."
        />
    );
}
