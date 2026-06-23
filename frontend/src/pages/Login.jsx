import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shirt, Loader2 } from "lucide-react"
import api from "@/services/api"
import { toast } from "sonner"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data } = await api.post("/auth/login", { email, password })
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      toast.success("Login berhasil")
      navigate("/dashboard")
    } catch {
      toast.error("Email atau password salah")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Shirt className="size-10 mx-auto mb-2 text-primary" />
          <CardTitle className="text-xl">Laundry App</CardTitle>
          <p className="text-sm text-muted-foreground">
            Masuk ke akun Anda
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="admin@laundry.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Password
              </label>
              <Input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
              Masuk
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}