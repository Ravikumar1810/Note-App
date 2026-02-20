import { motion } from "framer-motion";

export default function ResetPassword() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0B0F19] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-[#111827] border border-gray-800 rounded-xl p-8 text-white"
      >
        <h2 className="text-xl font-semibold mb-2">
          Reset password
        </h2>

        <p className="text-sm text-gray-400 mb-6">
          Enter your new password below.
        </p>

        <input
          type="password"
          className="auth-input"
          placeholder="New password"
        />

        <input
          type="password"
          className="auth-input mt-3"
          placeholder="Confirm password"
        />

        <button className="auth-btn w-full mt-4">
          Update Password
        </button>
      </motion.div>
    </div>
  );
}
