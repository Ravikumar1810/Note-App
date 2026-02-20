import { useState } from "react";
import { X } from "lucide-react";
import { updateNote } from "../../services/notes.api";

export default function EditNoteModal({ note, onClose, onSuccess }) {
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!title || !description) return;

    try {
      setLoading(true);
      await updateNote(note._id, { title, description });
      onSuccess();
      onClose();
    } catch {
      alert("Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#0f172a] w-full max-w-md rounded-xl p-6 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-2 rounded-full bg-gray-800 hover:bg-gray-700 cursor-pointer"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Edit Note</h2>

        <input
          className="auth-input mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="auth-input h-28 resize-none mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="auth-btn w-full"
        >
          {loading ? "Updating..." : "Update Note"}
        </button>
      </div>
    </div>
  );
}
