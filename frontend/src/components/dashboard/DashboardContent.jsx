import { useEffect, useState } from "react";
import { deleteNote, getAllNotes, updateNote } from "../../services/notes.api";
import { Pencil, Trash2 } from "lucide-react";
import AddNoteModal from "./AddNoteModal";
import EditNoteModal from "./EditNoteModal";
import { toast } from "react-hot-toast";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function DashboardContent() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const [deleteNoteTitle, setDeleteNoteTitle] = useState("");


  const fetchNotes = async () => {
    try {
      const res = await getAllNotes();
      setNotes(res.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // TOGGLE STATUS
  const handleToggleStatus = async (note) => {
    const newStatus =
      note.status === "completed" ? "incompleted" : "completed";

    // Optimistic UI update
    setNotes((prev) =>
      prev.map((n) =>
        n._id === note._id ? { ...n, status: newStatus } : n
      )
    );

    try {
      await updateNote(note._id, { status: newStatus });
      toast.success("Status updated");
    } catch (err) {
      // rollback if error
      setNotes((prev) =>
        prev.map((n) =>
          n._id === note._id ? note : n
        )
      );
    }
  };

  // DELETE NOT

  const confirmDelete = async () => {
  const prevNotes = notes;

  setNotes((prev) => prev.filter((n) => n._id !== deleteNoteId));

  try {
    await deleteNote(deleteNoteId);
    toast.success("Note deleted successfully");
  } catch (err) {
    setNotes(prevNotes);
    toast.error("Failed to delete note");
  } finally {
    setDeleteNoteId(null);
    setDeleteNoteTitle("");
  }
};


  // UPDATE NOTE
   
  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-10">
        Loading notes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 mt-10">
        Failed to load notes
      </div>
    );
  }

  return (
    <div className="px-8 py-6 text-white max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold tracking-wide">Add your<span className="text-indigo-400"> Notes</span></h2>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg cursor-pointer transition duration-200 max-w-sm"
        >
          + Add
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-700 shadow-sm sm:rounded-lg animate-fadeIn duration-300">
        <table className="w-full text-left">
          <thead className="bg-[#0f172a] text-gray-400 text-sm">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-center">Update</th>
            </tr>
          </thead>

          <tbody>
            {notes.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-400">
                  No notes yet   
                  <br />
                </td>
              </tr>
            ) : (
              notes.map((note) => (
                <tr
                  key={note._id}
                  className="border-t border-gray-800 hover:bg-[#0f172a] transition"
                >
                  <td className="px-4 py-3">{note.title}</td>

                  <td className="px-4 py-3 text-gray-400">
                    {note.description}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <input
                        type="checkbox"
                        checked={note.status === "completed"}
                        onChange={() => handleToggleStatus(note)}
                        className="w-4 h-4 accent-indigo-500 cursor-pointer"
                      />

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                          ${note.status === "completed"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-yellow-500/15 text-yellow-400"
                          }`}
                      >
                        {note.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-400">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <Pencil
                      size={16} 
                      onClick={() => setEditingNote(note)}
                      className="inline cursor-pointer text-indigo-400 hover:text-indigo-500 mr-5"
                    />
                    <Trash2
                      size={16}
                      onClick={() => {
                        setDeleteNoteId(note._id);
                        setDeleteNoteTitle(note.title);
                      }}
                      className="inline cursor-pointer text-red-400 hover:text-red-500"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddNoteModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchNotes}
        />
      )}


      {/* Edit Modal */}
      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onClose={() => setEditingNote(null)}
          onSuccess={fetchNotes}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={!!deleteNoteId}
        noteTitle={deleteNoteTitle}
        onClose={() => {
          setDeleteNoteId(null);
          setDeleteNoteTitle("");
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
