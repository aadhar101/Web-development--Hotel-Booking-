import { getUserById } from "../../../../../lib/actions/admin/user-action";
import UpdateUserForm from "../../_components/updateprofile";
import { notFound } from "next/navigation";
export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getUserById(id);
  if (!result.success || !result.data) return notFound();
  return <div className="max-w-lg space-y-4"><h1 className="text-2xl font-bold">Edit User</h1><UpdateUserForm user={result.data} /></div>;
}