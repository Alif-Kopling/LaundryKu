import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "@/components/ProtectedRoute"
import DashboardLayout from "@/layouts/DashboardLayout"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Dashboard from "@/pages/Dashboard"
import Customers from "@/pages/Customers"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/transactions" element={<div>Transaksi</div>} />
        <Route path="/invoice" element={<div>Invoice</div>} />
        <Route path="/history" element={<div>Riwayat</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
