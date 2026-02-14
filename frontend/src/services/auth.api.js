import api from "./api";

// LOGIN
export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

// SIGNUP (SEND OTP)
export const signupUser = async (data) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

// VERIFY OTP
export const verifySignupOtp = async (data) => {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
};

// FORGOT PASSWORD
export const forgotPassword = async (data) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

// RESET PASSWORD
export const resetPassword = async (data) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

// REFRESH TOKEN
export const refreshToken = async () => {
    const response = await api.post("/auth/refresh-token");
    return response.data;
}
