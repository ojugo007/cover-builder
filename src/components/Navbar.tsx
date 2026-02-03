// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"



const Navbar = () => {
  const { isAuthenticated, isProfileComplete } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/auth/login")
    window.location.reload()
  }

  return (
    <nav className="hidden sm:block">
      <div className="container mx-auto px-4 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          <img src="/cov-buildr.svg" alt="logo" className=" w-40 "  />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white hover:text-slate-400">
            Home
          </Link>

          {isAuthenticated ? (
            <>
              {/* Authenticated User Links */}
              {isProfileComplete && (
                <Link to="/upload" className="text-white hover:text-slate-400">
                  Upload
                </Link>
              )}
              
              <Link to="/complete-profile" className="text-white hover:text-slate-400">
                Profile
              </Link>

              <Button onClick={handleLogout} className="cursor-pointer bg-white text-black border-0 hover:text-white hover:bg-slate-700">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              
              <Link to="/auth/Signup">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;