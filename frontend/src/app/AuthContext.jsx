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
      //  Only attempt verifyToken if cookies exist
      if (!document.cookie.includes("refreshtoken")) {
        setLoading(false);
        return;
      }

      const res = await api.post("/verifyToken");
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
      console.log("Verify token failed", err.response?.status); 
    } finally {
      setLoading(false);
    }
  };

  initAuth();
}, []);



  const login = ({ token, user }) => {
    setAccessToken(token);
    setToken(token);
    setUser(user);
    setLoading(false);
  };

  const logout = () => {
    setAccessToken(null);
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
