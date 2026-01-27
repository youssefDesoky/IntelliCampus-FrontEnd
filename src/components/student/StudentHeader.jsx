import useDeviceType from "../../hooks/useDeviceType";
import Header from "../common/Header";

export default function StudentHeader({ userData }) {
    const { isMobile } = useDeviceType();

    return (
        <Header userData={userData} isMobile={isMobile} />
    );
}