import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../components/layout/AuthLayout";
import AuthSideImage from "../../components/layout/AuthSideImage";
import { signupSchema, otpSchema } from "./signupSchema";
import {
  signupUser,
  verifySignupOtp,
  resendSignupOtp,
} from "../../services/auth.api";
import { setAccessToken } from "../../services/api";
import { useAuth } from "../../app/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [step, setStep] = useState("FORM"); // FORM | OTP
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [emailForOtp, setEmailForOtp] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const[success,setSuccess] = useState(null);
  const[otpLoading,setOtpLoading] = useState(false);

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

  const onSignupSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      await signupUser(data);
      setEmailForOtp(data.email);
      setStep("OTP");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };


  const onOtpSubmit = async (data) => {
    setOtpLoading(true);
    setError(null);

    try {
      const res = await verifySignupOtp({
        email: emailForOtp,
        enterotp: data.otp,
      });

      // 1️ Save token in axios memory
      setAccessToken(res.accessToken);

      // 2️ Save token in auth context
      login({
        token: res.accessToken,
        user: res.user,
      });
      console.log("token is: " , res.accessToken)
      console.log("user is: " , res.user)

      // 3️ Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "OTP verification failed. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

const handleResendOtp = async () => {
  setError(null);
  setSuccess(null);

  try {
    await resendSignupOtp({ email: emailForOtp });
    setSuccess("OTP resent successfully. Please check your email.");
  } catch (err) {
    setError(err);
  }
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
                  {loading ? "Sending OTP..." : "Send OTP →"}
                </button>

                {error && (
                  <p className="text-red-400 text-xs mb-4">{error.message}</p>
                )}
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
                {success && (
                  <p className="text-green-400 text-sm mb-4 text-center">
                    {success}
                  </p>
                )}

                {error && (
                  <p className="text-red-400 text-sm mb-4 text-center">
                    {error.message || error}
                  </p>
                )}

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
              type="button"
              onClick={handleResendOtp}
              className="text-sm text-indigo-400 hover:underline w-full text-center mt-4"
            >
              Didn’t receive OTP? Resend
            </button>

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
