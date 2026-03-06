
import { getAllUsers } from "../../../lib/actions/admin/user-action";
import UserTable from "./_components/usertable";
import Link from "next/link";
export const metadata = { title: "Manage Users" };
export default async function UsersPage() {
  const result = await getAllUsers();
  const users = result.data?.data ?? [];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link href="/admin/users/create" className="px-4 py-2 rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90">+ Add User</Link>
      </div>
      <UserTable users={users} />
    </div>
  );
}
