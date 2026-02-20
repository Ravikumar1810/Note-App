import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout";
import AuthSideImage from "../../components/layout/AuthSideImage";

import {
  forgotPassword,
  verifySignupOtp,
  resetPassword,
  resendResetOtp,
} from "../../services/auth.api";

import {
  emailSchema,
  otpSchema,
  resetPasswordSchema,
} from "./forgotPasswordSchema";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState("EMAIL"); // EMAIL → OTP → RESET
  const [showPassword, setShowPassword] = useState(false);

  const [emailForReset, setEmailForReset] = useState("");
  const [resetToken, setResetToken] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const emailForm = useForm({ resolver: zodResolver(emailSchema) });
  const otpForm = useForm({ resolver: zodResolver(otpSchema) });
  const resetForm = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const showError = (err) =>
    err?.message || err || "Something went wrong";

  /* -------------------- 1️⃣ SEND OTP -------------------- */
  const handleSendOtp = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await forgotPassword({ email: data.email });
      setEmailForReset(data.email);
      setStep("OTP");
      setSuccess("OTP sent to your email.");
    } catch (err) {
      setError(showError(err));
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- 2️⃣ VERIFY OTP -------------------- */
  const handleVerifyOtp = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await verifySignupOtp({
        email: emailForReset,
        enterotp: data.otp,
      });

      if (!res?.resetToken) {
        throw "Reset token not received";
      }

      setResetToken(res.resetToken);
      setStep("RESET");
    } catch (err) {
      setError(showError(err));
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- 3️⃣ RESET PASSWORD -------------------- */
  const handleResetPassword = async (data) => {
    if (!resetToken) {
      setError("Reset token missing. Please verify OTP again.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await resetPassword({
        resetToken,
        newpassword: data.password,
        confirmpassword: data.confirmPassword.toString(),
      });


      setSuccess("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(showError(err));
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- 4️⃣ RESEND OTP -------------------- */
  const handleResendOtp = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await resendResetOtp({ email: emailForReset });
      setSuccess("OTP resent successfully. Check your email.");
    } catch (err) {
      setError(showError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthSideImage />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-center p-8 w-full"
      >
        <div className="w-full max-w-sm bg-[#111827] border border-gray-800 rounded-xl p-8 text-white">
          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-400 text-sm mb-4 text-center">
              {success}
            </p>
          )}

          {/* ---------------- EMAIL STEP ---------------- */}
          {step === "EMAIL" && (
            <>
              <h1 className="text-xl font-semibold mb-2">
                Forgot password
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                Enter your registered email to receive an OTP.
              </p>

              <form onSubmit={emailForm.handleSubmit(handleSendOtp)}>
                <input
                  {...emailForm.register("email")}
                  className="auth-input mb-2"
                  placeholder="Email"
                />

                <button
                  className="auth-btn w-full"
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP →"}
                </button>
              </form>

              <p className="text-sm text-gray-400 text-center mt-6">
                Back to{" "}
                <Link
                  to="/login"
                  className="text-indigo-400 hover:underline"
                >
                  Login
                </Link>
              </p>
            </>
          )}

          {/* ---------------- OTP STEP ---------------- */}
          {step === "OTP" && (
            <>
              <h1 className="text-xl font-semibold mb-2">
                Verify OTP
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                Enter the OTP sent to your email.
              </p>

              <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)}>
                <input
                  {...otpForm.register("otp")}
                  className="auth-input mb-2 text-center tracking-widest"
                  placeholder="••••••"
                />

                <button
                  className="auth-btn w-full mb-4"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify OTP →"}
                </button>
              </form>

              <button
                type="button"
                onClick={handleResendOtp}
                className="text-sm text-indigo-400 hover:underline w-full text-center"
                disabled={loading}
              >
                Didn’t receive OTP? Resend
              </button>
            </>
          )}

          {/* ---------------- RESET STEP ---------------- */}
          {step === "RESET" && (
            <>
              <h1 className="text-xl font-semibold mb-2">
                Reset password
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                Enter your new password.
              </p>

              <form
                onSubmit={resetForm.handleSubmit(
                  handleResetPassword
                )}
              >
                <div className="relative mb-2">
                  <input
                    {...resetForm.register("password")}
                    type={showPassword ? "text" : "password"}
                    className="auth-input pr-16"
                    placeholder="New password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((p) => !p)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-400 hover:underline"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <input
                  {...resetForm.register("confirmPassword")}
                  type={showPassword ? "text" : "password"}
                  className="auth-input mb-4"
                  placeholder="Confirm password"
                />

                <button
                  className="auth-btn w-full"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset password →"}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </AuthLayout>
  );
}
