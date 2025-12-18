import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Hompage from './pages/Hompage.tsx'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import Profile from './pages/Profile.tsx'
import Generator from './pages/Generator.tsx'
import NotFound from './pages/NotFound.tsx'
import { Toaster } from "@/components/ui/sonner"

const router = createBrowserRouter([
  {
    path:'/',
    element: <Hompage/>,
    errorElement: <NotFound/>
  },
  {
    path:'/auth/login',
    element: <Login/>,
  },
  {
    path:'/auth/Signup',
    element: <Signup/>,
  },
  {
    path:'/profile',
    element: <Profile/>,
  },
  {
    path:'/generate-coverletter',
    element: <Generator/>,
  },
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster/>
    <RouterProvider router={router}/>
  </StrictMode>,
)
