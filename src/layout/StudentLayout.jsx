import Layout from "./Layout";
import StudentAside from "../components/student/StudentAside";
import StudentHeader from "../components/student/StudentHeader";
import { Outlet } from "react-router-dom";
import Fahim from "../components/student/Fahim.jsx";
import StudentBottomBar from "../components/student/StudentBottomBar.jsx";

export default function StudentLayout({ studentData }) {  
  return (
    <Layout 
      header={ <StudentHeader userData={studentData} /> } 
      aside={ <StudentAside height={80} /> } 
      bottomBar={ <StudentBottomBar /> }
    >

      <Outlet />
      {/* <Fahim /> */}
    </Layout>
  );
}