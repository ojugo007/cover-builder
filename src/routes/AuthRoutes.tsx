import React from 'react'
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext";

type JwtPayload = {
    exp?: number;
};

interface AuthRoutesProps {
    children: React.ReactNode;
}

const isTokenExpired = (token: string) :boolean => {
    try {
        const decode = jwtDecode<JwtPayload>(token)
        if(!decode.exp) return true

        const currentTime = Math.floor(Date.now() / 1000)
        
        return decode.exp! < currentTime;

    } catch (error) {
        return true
    }
}

const AuthRoutes = ({children}: AuthRoutesProps) => {
    const token = localStorage.getItem('token')

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token")
        return <Navigate to="/access-denied" replace/>
    }

    const decoded = jwtDecode<JwtPayload>(token);
    return (
        <AuthProvider user={decoded}>
            {children}
        </AuthProvider>
    )
}

export default AuthRoutes