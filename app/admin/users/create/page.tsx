import CreateUserForm from "../_components/createuserform";
export const metadata = { title: "Create User" };
export default function CreateUserPage() {
  return <div className="max-w-lg space-y-4"><h1 className="text-2xl font-bold">Create User</h1><CreateUserForm /></div>;
}