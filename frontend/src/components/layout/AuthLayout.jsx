
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0B0F19]">

      <div className="flex items-center justify-center px-4 py-12 ">
        <div className="w-full max-w-5xl bg-[#0F172A] rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {children}
        </div>
      </div>
    </div>
  );
}

