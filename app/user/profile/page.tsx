import { getMyProfile } from "../../../lib/actions/user/profile-action";
import UpdateProfile from "../_components/updateprofile";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const result = await getMyProfile();
  const user = (result.success ? result.data : null) as any;
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <section className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/75 dark:bg-white/5 p-6 backdrop-blur-sm">
        <p className="text-sm text-foreground/60">Account center</p>
        <h1 className="mt-1 text-3xl font-bold">My Profile</h1>
        <p className="mt-2 text-sm text-foreground/70">Manage your personal details, contact info, and address for faster bookings.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/75 dark:bg-white/5 p-5 h-fit backdrop-blur-sm">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Profile avatar"
              className="h-16 w-16 rounded-full object-cover border border-black/10 dark:border-white/20"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-blue-600 text-white grid place-items-center text-lg font-bold">
              {(user?.firstName?.[0] ?? "U").toUpperCase()}
            </div>
          )}
          <h2 className="mt-3 text-lg font-semibold">{user?.firstName} {user?.lastName}</h2>
          <p className="text-sm text-foreground/60">{user?.email}</p>
          <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-foreground/70">
            <div className="rounded-md bg-black/5 dark:bg-white/10 px-3 py-2">Profile completion: active</div>
            <div className="rounded-md bg-black/5 dark:bg-white/10 px-3 py-2">Keep your phone and address updated</div>
          </div>
        </aside>

        <section className="lg:col-span-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white/75 dark:bg-white/5 p-6 backdrop-blur-sm">
          <UpdateProfile user={user} />
        </section>
      </div>
    </div>
  );
}
