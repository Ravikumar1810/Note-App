export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-[#0B0F19] text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-center">
        © {new Date().getFullYear()} NotesPro. All rights reserved.
      </div>
    </footer>
  );
}
