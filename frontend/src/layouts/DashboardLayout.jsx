import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileText,
  History,
  LogOut,
  Menu,
  X,
  Shirt,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/customers", label: "Pelanggan", icon: Users },
  { to: "/transactions", label: "Transaksi", icon: ShoppingCart },
  { to: "/invoice", label: "Nota", icon: FileText },
  { to: "/history", label: "Riwayat", icon: History },
]

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar-background border-r border-sidebar-border transform transition-transform duration-200 lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-2 p-4">
          <Shirt className="size-6 text-primary" />
          <span className="font-semibold text-lg">Laundry App</span>
        </div>

        <Separator />

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <Separator />

        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="size-8">
              <AvatarFallback>
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{user.name || "User"}</p>
              <p className="text-muted-foreground capitalize">
                {user.role || "owner"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="size-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 p-4 border-b bg-background lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
          <h1 className="font-semibold">Laundry App</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}