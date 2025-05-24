import { useAuthQuery } from "@/hooks/useAuthQuery";
import { AuthContextType } from "@/types";
import { createContext, ReactNode } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthQuery();

  return (
    <AuthContext.Provider
      value={{
        user: auth.user ?? null,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        login: auth.login,
        logout: auth.logout,
        error: auth.error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
