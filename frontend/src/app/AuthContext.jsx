import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const res = await api.post("/verifyToken");

        if (!mounted) return;

        setAccessToken(res.data.accessToken);
        setToken(res.data.accessToken);
        setUser(res.data.user || null);
      } catch (err) {
        if (!mounted) return;
        setAccessToken(null);
        setToken(null);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
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
