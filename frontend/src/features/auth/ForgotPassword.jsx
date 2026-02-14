
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../components/layout/AuthLayout";
import AuthSideImage from "../../components/layout/AuthSideImage";

import {
  emailSchema,
  otpSchema,
  resetPasswordSchema,
} from "./forgotPasswordSchema";

export default function ForgotPassword() {
  const [step, setStep] = useState("EMAIL"); // EMAIL → OTP → RESET
  const [showPassword, setShowPassword] = useState(false);

  const emailForm = useForm({ resolver: zodResolver(emailSchema) });
  const otpForm = useForm({ resolver: zodResolver(otpSchema) });
  const resetForm = useForm({ resolver: zodResolver(resetPasswordSchema) });

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-center p-8 w-full"
      >
        <div className="w-full max-w-sm bg-[#111827] border border-gray-800 rounded-xl p-8">
          {step === "EMAIL" && (
            <>
              <h1 className="text-xl font-semibold text-white mb-2">
                Forgot password
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                Enter your registered email to receive an OTP.
              </p>

              <form
                onSubmit={emailForm.handleSubmit((data) => {
                  console.log("EMAIL", data);
                  setStep("OTP");
                })}
              >
                <input
                  {...emailForm.register("email")}
                  className="auth-input mb-2"
                  placeholder="Email"
                />
                {emailForm.formState.errors.email && (
                  <p className="text-red-400 text-xs mb-4">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}

                <button className="auth-btn w-full">
                  Send OTP →
                </button>
              </form>
            </>
          )}

          {step === "OTP" && (
            <>
              <h1 className="text-xl font-semibold text-white mb-2">
                Verify OTP
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                Enter the OTP sent to your email.
              </p>

              <form
                onSubmit={otpForm.handleSubmit((data) => {
                  console.log("OTP", data);
                  setStep("RESET");
                })}
              >
                <input
                  {...otpForm.register("otp")}
                  className="auth-input mb-2 text-center tracking-widest"
                  placeholder="••••••"
                />
                {otpForm.formState.errors.otp && (
                  <p className="text-red-400 text-xs mb-4">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}

                <button className="auth-btn w-full mb-4">
                  Verify OTP →
                </button>
              </form>

              <button
                onClick={() => setStep("EMAIL")}
                className="text-sm text-gray-400 hover:underline w-full text-center"
              >
                ← Back
              </button>
            </>
          )}

          {step === "RESET" && (
            <>
              <h1 className="text-xl font-semibold text-white mb-2">
                Reset password
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                Enter your new password.
              </p>

              <form
                onSubmit={resetForm.handleSubmit((data) => {
                  console.log("RESET PASSWORD", data);
                })}
              >
               <div className="relative mb-2 cursor-text">
                  <input
                    {...resetForm.register("password")}
                    type={showPassword ? "text" : "password"}
                    className="auth-input pr-16"
                    placeholder="New password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-400 hover:underline focus:outline-none cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <input
                    {...resetForm.register("confirmPassword")}
                    type={showPassword ? "text" : "password"}
                    className="auth-input mb-2"
                    placeholder="Confirm password"
                  />

                {resetForm.formState.errors.confirmPassword && (
                  <p className="text-red-400 text-xs mb-4">
                    {resetForm.formState.errors.confirmPassword.message}
                  </p>
                )}

                <button className="auth-btn w-full">
                  
                  Reset password →
                </button>
              </form>
            </>
          )}
        </div>
        
      </motion.div>
      <AuthSideImage />
    </AuthLayout>
  );
}
