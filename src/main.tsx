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
import Unauthorized from './pages/Unauthorized.tsx'
import AuthRoutes from "@/routes/AuthRoutes";

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
    element:(
      <AuthRoutes>
        <Profile/>
      </AuthRoutes>
    ) 
    
  },
  {
    path:'/upload',
    element:( 
      <AuthRoutes>
        <Generator/>
      </AuthRoutes>
    ),
  },
  {
    path:'/access-denied',
    element: <Unauthorized/>,
  },
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster/>
    <RouterProvider router={router}/>
  </StrictMode>,
)
