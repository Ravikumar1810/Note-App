import { useState } from "react";
import { X } from "lucide-react";
import { createNote } from "../../services/notes.api";

export default function AddNoteModal({ onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async () => {
    if (!title || !description) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await createNote({ title, description });
      onSuccess(); // refresh notes
      onClose();   // close modal
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#0f172a] w-full max-w-md rounded-xl p-6 text-white relative">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Add Note</h2>

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        <input
          className="auth-input mb-3"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="auth-input mb-4 resize-none h-28"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          className="auth-btn w-full"
        >
          {loading ? "Creating..." : "Create Note"}
        </button>
      </div>
    </div>
  );
}
