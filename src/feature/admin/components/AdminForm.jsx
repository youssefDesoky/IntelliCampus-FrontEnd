import InputItem from "../../../components/form/InputItem";
import UserForm from "./UserForm";

export default function AdminForm({ onClose, method = "post", action, initialData = {} }) {
    return (
        <UserForm role="admin" method={method} action={action} onClose={onClose} initialData={initialData}>
            <div className="grid grid-cols-2 gap-6">
                <InputItem label="Hire Date" type="date" id="hireDate" name="hireDate" defaultValue={initialData.hireDate || new Date().toISOString().split('T')[0]} required />
            </div>
        </UserForm>
    );
}
