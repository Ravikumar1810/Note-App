import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function VerifyOtp() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0B0F19] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-[#111827] border border-gray-800 rounded-xl p-8 text-white"
      >
        <h2 className="text-xl font-semibold mb-2">Verify OTP</h2>
        <p className="text-sm text-gray-400 mb-6">
          Enter the 6-digit code sent to your email.
        </p>

        <input
          className="auth-input text-center tracking-widest"
          placeholder="______"
          maxLength={6}
        />

        <button className="auth-btn w-full mt-4">
          Verify & Continue
        </button>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Didn’t receive OTP?{" "}
          <Link className="text-indigo-400 hover:underline">
            Resend
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
