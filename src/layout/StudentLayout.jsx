import Layout from "./Layout";
import StudentAside from "../components/student/StudentAside";
import StudentHeader from "../components/student/StudentHeader";
import { Outlet } from "react-router-dom";
import Fahim from "../components/student/Fahim.jsx";

export default function StudentLayout({ studentData }) {
  const height = 80;
  return (
    <Layout header={<StudentHeader height={height} userData={studentData} />} aside={<StudentAside height={height} />}>
      <Outlet />
      <Fahim />
    </Layout>
  );
}