import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {

      try {
        const res = await api.post("/verifyToken");
          setAccessToken(res.data.accessToken);
          setToken(res.data.accessToken);
          setUser(res.data.user || null);
      } catch (err) {
        setToken(null);
        setUser(null);   
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = ({ token, user }) => {
    setAccessToken(token);
    setToken(token);
    setUser(user || null);
    setLoading(false);
    console.log("User logged in:", { token, user }); // Debug log
  };

  const logout = () => {
    setAccessToken(null);
    setToken(null);
    setUser(null);
    window.location.href="/login"
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, user, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
