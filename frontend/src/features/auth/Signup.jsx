import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../components/layout/AuthLayout";
import AuthSideImage from "../../components/layout/AuthSideImage";
import { signupSchema, otpSchema } from "./signupSchema";

export default function Signup() {
  const [step, setStep] = useState("FORM"); // FORM | OTP
  const [showPassword, setShowPassword] = useState(false);

  // Signup form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  // OTP form
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  const onSignupSubmit = (data) => {
    console.log("SIGNUP DATA", data);
    // later → send OTP API
    setStep("OTP");
  };

  const onOtpSubmit = (data) => {
    console.log("OTP DATA", data);
    // later → verify OTP API
  };

  return (
    <AuthLayout>
      <AuthSideImage />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-center p-8"
      >
        <div className="w-full max-w-sm">
          {step === "FORM" && (
            <>
              <h1 className="text-2xl font-semibold text-white mb-1">
                Create account
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                Start managing your notes efficiently.
              </p>

              <form onSubmit={handleSubmit(onSignupSubmit)}>
                <input
                  {...register("username")}
                  className="auth-input mb-2"
                  placeholder="Username"
                />
                {errors.username && (
                  <p className="text-red-400 text-xs mb-2">
                    {errors.username.message}
                  </p>
                )}

                <input
                  {...register("email")}
                  className="auth-input mb-2"
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mb-2">
                    {errors.email.message}
                  </p>
                )}

                <div className="relative mb-4">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className="auth-input pr-16"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-400 hover:underline focus:outline-none cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mb-4">
                    {errors.password.message}
                  </p>
                )}

                <button type="submit" className="auth-btn mb-4">
                  Send OTP →
                </button>
              </form>

              <p className="text-sm text-gray-400 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-400 hover:underline">
                  Login
                </Link>
              </p>
            </>
          )}

          {step === "OTP" && (
            <>
              <h1 className="text-2xl font-semibold text-white mb-1 mt-4 cursor-pointer">
                Verify OTP
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                Enter the 6-digit OTP sent to your email.
              </p>

              <form onSubmit={handleOtpSubmit(onOtpSubmit)}>
                <input
                  {...registerOtp("otp")}
                  className="auth-input mb-2 text-center tracking-widest"
                  placeholder="••••••"
                />
                {otpErrors.otp && (
                  <p className="text-red-400 text-xs mb-4">
                    {otpErrors.otp.message}
                  </p>
                )}

                <button type="submit" className="auth-btn mb-4">
                  Verify & Continue →
                </button>
              </form>

              <button
                onClick={() => setStep("FORM")}
                className="text-sm text-gray-400 text-center w-full block mb-7 mt-4 cursor-pointer hover:underline"
              >
                ← Go back
              </button>
            </>
          )}
        </div>
      </motion.div>
    </AuthLayout>
  );
}
