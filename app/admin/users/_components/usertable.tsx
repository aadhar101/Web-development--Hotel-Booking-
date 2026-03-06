"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { toggleUserStatus, deleteUser } from "../../../../lib/actions/admin/user-action";
interface User { _id: string; firstName: string; lastName: string; email: string; role: string; isActive: boolean; }
export default function UserTable({ users }: { users: User[] }) {
  const [list, setList] = useState(users);
  const [pending, setTransition] = useTransition();
  const handleToggle = (id: string) => { setTransition(async () => { const res = await toggleUserStatus(id); if (res.success) setList(p => p.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u)); }); };
  const handleDelete = (id: string) => { if (!confirm("Delete this user?")) return; setTransition(async () => { const res = await deleteUser(id); if (res.success) setList(p => p.filter(u => u._id !== id)); }); };
  if (!list.length) return <p className="text-sm text-foreground/60">No users found.</p>;
  return (
    <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-black/10 dark:border-white/10">{["Name","Email","Role","Status","Actions"].map(h=><th key={h} className="px-4 py-3 text-left font-medium text-foreground/60">{h}</th>)}</tr></thead>
        <tbody>{list.map(user=>(
          <tr key={user._id} className="border-b border-black/5 last:border-0">
            <td className="px-4 py-3"><Link href={`/admin/users/${user._id}`} className="hover:underline font-medium">{user.firstName} {user.lastName}</Link></td>
            <td className="px-4 py-3 text-foreground/60">{user.email}</td>
            <td className="px-4 py-3 capitalize">{user.role}</td>
            <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.isActive?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>{user.isActive?"Active":"Inactive"}</span></td>
            <td className="px-4 py-3"><div className="flex gap-3">
              <Link href={`/admin/users/${user._id}/edit`} className="text-xs hover:underline">Edit</Link>
              <button onClick={()=>handleToggle(user._id)} disabled={pending} className="text-xs hover:underline text-foreground/60">{user.isActive?"Deactivate":"Activate"}</button>
              <button onClick={()=>handleDelete(user._id)} disabled={pending} className="text-xs hover:underline text-red-600">Delete</button>
            </div></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}