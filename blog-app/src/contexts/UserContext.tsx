import React, { ReactNode, createContext, useEffect, useState } from 'react'
import { User, register as registerUser } from '../services/users'

interface UserContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<User | null>
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<User | null>
  logout: () => void
}

interface UserProviderProps {
  children: ReactNode
}

export const UserContext = createContext<UserContextValue | undefined>(
  undefined
)

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const user: User = await response.json()
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      return user
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    const user = await registerUser(email, password, username)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    }
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const value: UserContextValue = { user, login, register, logout }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
