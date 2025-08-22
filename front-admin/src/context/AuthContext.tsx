import React, { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

// Типизация токена, если ты знаешь структуру JWT
interface DecodedToken {
  role: string;
  email: string;
}

// Тип контекста
interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  role: string | null;
  email: string | null;
}

// Значение по умолчанию (можно пустые функции)
export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  role: null,
  email: null,
});

// Тип пропсов провайдера
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") || sessionStorage.getItem("token") || null
  );

  useEffect(() => {
    const syncToken = () => {
      const latestToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      setToken(latestToken);
    };
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  let role: string | null = null;
  let email: string | null = null;
  try {
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      role = decoded.role || null;
      email = decoded.email || null;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    role = null;
    email = null;
  }

  return (
    <AuthContext.Provider value={{ token, setToken, role, email }}>
      {children}
    </AuthContext.Provider>
  );
};
