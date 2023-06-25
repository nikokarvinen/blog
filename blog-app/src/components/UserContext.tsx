import React, { ReactNode, createContext, useState } from 'react'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
}

interface UserProviderProps {
  children: ReactNode
}

interface UserContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<User | null>
}

export const UserContext = createContext<UserContextValue | undefined>(
  undefined
)

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
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

  const value: UserContextValue = { user, login }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
