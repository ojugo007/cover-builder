import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useRef } from "react"
import { toast } from "sonner" 
import { CircleAlert } from "lucide-react"

const ProfileCompleteRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isProfileComplete } = useAuth()
  const useMount =  useRef(false);

  useEffect(() => {
    if(useMount.current === true){
      if (isAuthenticated && !isProfileComplete) {
        
        toast(
          <div className="flex items-center gap-2">
            <CircleAlert size={18} className="text-black bg-yellow-300 rounded-full" />
            <span>Please complete your profile first</span>
          </div>
          , {
            unstyled: true,
            className: 'bg-yellow-200 text-black p-2 rounded',
            duration: 5000,
          }
        )
  
      }
    }
    return ()=>{
      useMount.current = true
    }
  }, [isAuthenticated, isProfileComplete])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isProfileComplete) {
    return <Navigate to="/complete-profile" replace />
  }

  return children
}

export default ProfileCompleteRoute