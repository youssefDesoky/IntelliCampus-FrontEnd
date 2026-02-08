import { useState } from "react";
import Table from "../../../components/ui/Table";
import UserHeader from "../../../components/ui/UserHeader";
import AdminForm from "../../../feature/admin/components/AdminForm";

export default function ManageAdmins() {
    const [isAddAdminFormOpen, setIsAddAdminFormOpen] = useState(false);

    return (
        <>
            <UserHeader role="admin" setIsUserFormOpen={setIsAddAdminFormOpen} />

            <Table role="admin" headers={adminTableHeaders} data={adminTableData} />

            {isAddAdminFormOpen && <AdminForm method="post" onClose={() => setIsAddAdminFormOpen(false)} />}
        </>
    );
}



const adminTableHeaders = [ "Admin", "Admin ID", "Role", "Department", "Hire Date" ];
const adminTableData = [
    {
        admin: (
            <div className="flex items-center justify-center gap-3">
                <img
                    src="https://tse4.mm.bing.net/th/id/OIP.IGNf7GuQaCqz_RPq5wCkPgHaLH?rs=1&pid=ImgDetMain&o=7&rm=3"
                    alt="Admin Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col text-left">
                    <p>Alice Brown</p>
                    <p>Administrator</p>
                </div>
            </div>
        ),
        adminID: "A3001",
        role: "System Admin",
        department: "IT Services",
        hireDate: "2015-03-20",
        // Form-only fields
        fullName: "Alice Brown",
        nationalID: "12345678",
        nationality: "us",
        email: "alice.brown@example.com",
        phone: "+1234567890",
        address: "123 Admin St, Tech City",
    },
    {
        admin: (
            <div className="flex items-center justify-center gap-3">
                <img
                    src="https://tse4.mm.bing.net/th/id/OIP.IGNf7GuQaCqz_RPq5wCkPgHaLH?rs=1&pid=ImgDetMain&o=7&rm=3"
                    alt="Admin Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col text-left">
                    <p>David Wilson</p>
                    <p>HR Manager</p>
                </div>
            </div>
        ),
        adminID: "A3002",
        role: "HR Manager",
        department: "Human Resources",
        hireDate: "2017-11-05",
        // Form-only fields
        fullName: "David Wilson",
        nationalID: "87654321",
        nationality: "uk",
        email: "david.wilson@example.com",
        phone: "+1987654321",
        address: "456 HR Ave, Business Park",
    },
];