import Layout from "./Layout";
import { Outlet } from "react-router-dom";
import useDeviceType from "../hooks/useDeviceType";

export default function InstructorLayout({ instructorData }) {
    const { isMobile } = useDeviceType();
    
    return (
        <Layout 
        header={ <InstructorHeader userData={instructorData} /> } 
        aside={!isMobile ? <InstructorAside height={80} /> : null} 
        bottomBar={isMobile ? <InstructorBottomBar /> : null}
        >
            <Outlet />
        </Layout>
    );
}