import notesImage from "../../assets/auth-notes.png";

export default function AuthSideImage() {
  return (
    <div className="relative hidden md:flex items-center justify-center bg-gradient-to-br from-black via-blue-150 to-purple-200 p-8">
      
      {/* Image */}
      <img
        src={notesImage}
        alt="Notes preview"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-sm">
        <h2 className="text-3xl font-bold mb-4">
          Easy Sticky Notes
        </h2>
        <p className="text-sm leading-relaxed opacity-90">
          Organize tasks, ideas, and thoughts in one secure place.
        </p>
      </div>
    </div>
  );
}

