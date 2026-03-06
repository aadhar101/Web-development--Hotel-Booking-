// app/layout.tsx
import "./global.css";
import { ReactNode } from "react";
import { AuthProvider } from "../context/authcontext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
