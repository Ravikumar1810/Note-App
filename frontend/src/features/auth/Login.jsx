import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../components/layout/AuthLayout";
import AuthSideImage from "../../components/layout/AuthSideImage";
import { loginSchema } from "./loginSchema";
import { loginUser } from "../../services/auth.api";
import { setAccessToken } from "../../services/api";
import { useAuth } from "../../app/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const res = await loginUser(data);

      // 1️⃣ Save to auth context
      login({
        token: res.accessToken,
        user: res.user,
      });

      // 2️⃣ Attach token to axios
      setAccessToken(res.accessToken);

      // 3️⃣ Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err);
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
        className="flex items-center justify-center p-8"
      >
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-white mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Login to access your notes.
          </p>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
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

            <input
              {...register("password")}
              type="password"
              className="auth-input mb-4"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mb-4">
                {errors.password.message}
              </p>
            )}

            <div className="text-right mb-6">
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-btn mb-4 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          <p className="text-sm text-gray-400 text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-indigo-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
