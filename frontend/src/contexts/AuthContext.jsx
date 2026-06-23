import { createContext, useContext, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext(null)

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
  name: "Admin Laundry",
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (username, password) => {
    if (
      username !== ADMIN_CREDENTIALS.username ||
      password !== ADMIN_CREDENTIALS.password
    ) {
      throw new Error("Username atau password salah")
    }

    const userData = {
      id: 1,
      username: ADMIN_CREDENTIALS.username,
      name: ADMIN_CREDENTIALS.name,
    }

    localStorage.setItem("token", "mock-jwt-token")
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)

    return userData
  }, [])

  const register = useCallback(async (username, password, name) => {
    if (!username || !password || !name) {
      throw new Error("Semua field harus diisi")
    }

    if (username === ADMIN_CREDENTIALS.username) {
      throw new Error("Username sudah digunakan")
    }

    const userData = { id: Date.now(), username, name }
    localStorage.setItem("token", "mock-jwt-token")
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)

    return userData
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
