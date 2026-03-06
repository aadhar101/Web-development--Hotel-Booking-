import Link from "next/link";
export default function UserNotFound() {
  return <div className="flex flex-col items-center justify-center h-64 gap-4"><h2 className="text-xl font-bold">User Not Found</h2><Link href="/admin/users" className="text-sm font-semibold hover:underline">Back to users</Link></div>;
}