import ForgetPasswordForm from "../_components/forgrtpasswordform";
export const metadata = { title: "Forgot Password" };
export default function ForgetPasswordPage() {
  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Forgot password?</h1>
        <p className="mt-1 text-sm text-foreground/60">Enter your email and we&apos;ll send you a reset link</p>
      </div>
      <ForgetPasswordForm />
    </>
  );
}