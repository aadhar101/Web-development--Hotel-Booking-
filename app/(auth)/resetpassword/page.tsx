import { Suspense } from "react";
import ResetPasswordForm from "../_components/resetpasswordform";
export const metadata = { title: "Reset Password" };
export default function ResetPasswordPage() {
  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
        <p className="mt-1 text-sm text-foreground/60">Enter your new password below</p>
      </div>
      <Suspense fallback={<div className="text-center text-sm text-foreground/60">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </>
  );
}
