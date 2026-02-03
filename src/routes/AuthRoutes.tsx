import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

const AuthRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return children
}

export default AuthRoutes
