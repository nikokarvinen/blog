import React, { createContext, useState } from 'react'
import {
  User,
  login as loginUser,
  register as registerUser,
} from '../services/users'

interface UserContext {
  user: User | null
  login: (email: string, password: string) => Promise<User | null>
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<User | null>
  logout: () => void
}

interface UserProviderProps {
  children: React.ReactNode
}

const UserContext = createContext<UserContext>({} as UserContext)

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    const user = await loginUser(email, password)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    }
    setUser(user)
    return user
  }

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const user = await registerUser(email, password, firstName, lastName)
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

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export { UserContext, UserProvider }
