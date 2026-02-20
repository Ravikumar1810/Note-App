import api from "./api";
import publicApi from "./publicApi";

// ---------- AUTH (PUBLIC) ----------

// LOGIN
export const loginUser = async (data) => {
  const res = await publicApi.post("/login", data);
  return res.data;
};

// SIGNUP
export const signupUser = async (data) => {
  const res = await publicApi.post("/register", data);
  return res.data;
};

// VERIFY OTP (signup + reset)
export const verifySignupOtp = async (data) => {
  const res = await publicApi.post("/verify-otp", data);
  return res.data;
};

// FORGOT PASSWORD
export const forgotPassword = async (data) => {
  const res = await publicApi.post("/forgetpassword", data);
  return res.data;
};

// RESEND SIGNUP OTP
export const resendSignupOtp = async (data) => {
  const res = await publicApi.post("/resendsignupotp", data);
  return res.data;
};

// RESEND RESET OTP
export const resendResetOtp = async (data) => {
  const res = await publicApi.post("/resendResetotp", data);
  return res.data;
};

// RESET PASSWORD (IMPORTANT)
export const resetPassword = async (data) => {
  const res = await publicApi.post("/resetpass", data);
  return res.data;
};

// ---------- AUTH (PROTECTED) ----------

// REFRESH TOKEN
export const refreshToken = async () => {
  const res = await api.post("/verifyToken");
  return res.data;
};
