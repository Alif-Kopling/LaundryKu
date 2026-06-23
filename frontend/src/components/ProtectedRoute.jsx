import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const token = localStorage.getItem("token")
  const location = useLocation()

  if (!user) {
    if (token) {
      return children
    }
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
