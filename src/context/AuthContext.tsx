
import { createContext, useContext, useMemo } from "react"
import { jwtDecode } from "jwt-decode"

type JwtPayload = {
  exp: number
  profileCompleted: boolean
}

type AuthState = {
  isAuthenticated: boolean
  isProfileComplete: boolean
  user: JwtPayload | null
}

const AuthContext = createContext<AuthState | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token")

  const auth = useMemo<AuthState>(() => {
    if (!token) {
      return {
        isAuthenticated: false,
        isProfileComplete: false,
        user: null,
      }
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token)
      const isExpired = decoded.exp * 1000 < Date.now()

      if (isExpired) {
        localStorage.removeItem("token")
        return {
          isAuthenticated: false,
          isProfileComplete: false,
          user: null,
        }
      }

      return {
        isAuthenticated: true,
        isProfileComplete: decoded.profileCompleted,
        user: decoded,
      }
    } catch {
      return {
        isAuthenticated: false,
        isProfileComplete: false,
        user: null,
      }
    }
  }, [token])

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
