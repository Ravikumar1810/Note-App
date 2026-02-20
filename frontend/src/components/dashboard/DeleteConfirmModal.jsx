import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  noteTitle,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#020617] border border-gray-800 rounded-xl w-full max-w-sm p-6 text-white"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/15">
            <Trash2 className="text-red-400" />
          </div>
        </div>

        {/* Text */}
        <h3 className="text-lg font-semibold text-center mb-2">
          Delete Note?
        </h3>

        <p className="text-sm text-gray-400 text-center mb-6">
          Are you sure you want to delete{" "}
          <span className="text-white font-medium">
            “{noteTitle}”
          </span>
          ?  
          <br />
          This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
