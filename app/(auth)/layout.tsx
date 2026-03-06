// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    /* bg-[#f0f2f5] - This is the light gray background color for the page.
       min-h-screen - Ensures the background covers the full height of the browser.
       flex items-center justify-center - Centers your card horizontally and vertically.
    */
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f2f5] p-6">
        {children}
    </div>
  );
}