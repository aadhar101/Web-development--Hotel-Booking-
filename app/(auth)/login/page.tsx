import LoginForm from "../_components/loginform";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100/70 to-indigo-100/70 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
        <LoginForm />
      </div>
    </div>
  );
}
