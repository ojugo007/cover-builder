import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import MobileNavbar from "./MobileNavbar"

const Layout = () => {
  return (
    <div className="min-h-screen">
          <MobileNavbar/>
          <Navbar/>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout