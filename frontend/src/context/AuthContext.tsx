import { createContext, useContext } from "react"
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types"

export interface AuthContextType {
  user: AuthResponse | null
  isAuthenticated: boolean
  loading: boolean
  login: (request: LoginRequest) => Promise<void>
  register: (request: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
