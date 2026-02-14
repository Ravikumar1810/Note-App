import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0B0F19] text-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Simple notes.
          <br />
          <span className="text-indigo-400">Serious productivity.</span>
        </h1>

        <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
          Capture ideas, organize tasks, and manage your notes securely
          with a clean and distraction-free experience.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 rounded-md bg-indigo-500 hover:bg-indigo-600 transition text-white"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 rounded-md border border-gray-700 hover:bg-gray-800 transition"
          >
            Login
          </Link>
        </div>
      </section>
    </div>
  );
}
