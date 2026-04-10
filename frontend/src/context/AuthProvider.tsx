import React, { useState } from "react"
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types"
import { authService } from "@/services/auth.service"
import { AuthContext } from "./AuthContext"

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthResponse | null>(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [loading, setLoading] = useState(false)

  const login = async (request: LoginRequest) => {
    setLoading(true)
    try {
      const response = await authService.login(request)
      if (response.success && response.data) {
        localStorage.setItem("token", response.data.token)
        setUser(response.data)
        localStorage.setItem("user", JSON.stringify(response.data))
      } else {
        throw new Error(response.message || "Login failed")
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (request: RegisterRequest) => {
    setLoading(true)
    try {
      const response = await authService.register(request)
      if (response.success && response.data) {
        localStorage.setItem("token", response.data.token)
        setUser(response.data)
        localStorage.setItem("user", JSON.stringify(response.data))
      } else {
        throw new Error(response.message || "Registration failed")
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
