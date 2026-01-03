import React, { createContext, useContext } from "react";

type JwtPayload = {
    exp?: number;
    userId?: string;
    email?:string
    fullname?:string
};

type AuthContextType = {
  user: JwtPayload;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({
  user,
  children,
}: {
  user: JwtPayload;
  children: React.ReactNode;
}) => {
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
