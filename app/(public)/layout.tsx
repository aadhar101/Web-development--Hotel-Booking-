// app/(public)/PublicLayout.tsx
import Header from "./_components/header";
import { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover z-0"
        style={{
          backgroundImage: "url('/images/imagepublic.png')",
          opacity: 0.3,
        }}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Content */}
      <div className="relative z-20">
        <Header />
        <div>{children}</div>
      </div>
    </div>
  );
}
