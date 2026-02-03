// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"


const MobileNavbar = () => {
  const { isAuthenticated, isProfileComplete } = useAuth();
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/auth/login")
    window.location.reload()
  }


  const toggleMenu = () => {
    setShowMenu(prev => !prev)
  }

  return (

    <nav className="relative sm:hidden">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
            {/* Logo */}
            <Link onClick={() => setShowMenu(false)} to="/" className="text-xl font-bold">
            <img src="/cov-buildr.svg" alt="logo" className=" w-40 "  />
            </Link>

            <Button onClick={toggleMenu} >
                {showMenu? <X className="size-8"/> : <Menu className="size-8" />}
            </Button>
        </div>

        {/* Navigation Links */}
        <div className={ `w-full h-screen bg-black flex flex-col items-center gap-4 absolute top-full right-0 z-15 pt-8 transition-transform duration-300 ${showMenu ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <Link to="/" className="text-white hover:text-slate-400" onClick={() => setShowMenu(false)}>
            Home
          </Link>

          {isAuthenticated ? (
            <>
              {/* Authenticated User Links */}
              {isProfileComplete && (
                <Link to="/upload" className="text-white hover:text-slate-400" onClick={() => setShowMenu(false)}>
                  Upload
                </Link>
              )}
              
              <Link to="/complete-profile" className="text-white hover:text-slate-400" onClick={() => setShowMenu(false)}>
                Profile
              </Link>

              <Button onClick={handleLogout} className="cursor-pointer bg-white text-black border-0 hover:text-white hover:bg-slate-700">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth/login">
                <Button onClick={() => setShowMenu(false)} variant="ghost" size="sm" >
                  Login
                </Button>
              </Link>
              
              <Link to="/auth/Signup">
                <Button onClick={() => setShowMenu(false)} size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
    </nav>
  )
}

export default MobileNavbar;