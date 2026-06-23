import { Routes, Route, Navigate } from "react-router-dom"
import Login from "@/pages/Login"
import Dashboard from "@/pages/Dashboard"
import Customers from "@/pages/Customers"
import Transactions from "@/pages/Transactions"
import Invoice from "@/pages/Invoice"
import History from "@/pages/History"
import DashboardLayout from "@/layouts/DashboardLayout"

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token")
  if (!token) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("token")
  if (token) return <Navigate to="/dashboard" replace />
  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions/:id/invoice" element={<Invoice />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/history" element={<History />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}