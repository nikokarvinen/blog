import React, { ReactNode, createContext, useState } from 'react'
import { User } from './User'

// Define the props for the UserProvider component.
// It takes one prop 'children', which could be any valid React node.
interface UserProviderProps {
  children: ReactNode
}

// Define the shape of the UserContext.
interface UserContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<User | null>
}

// Create a UserContext using the shape we defined above.
// This will allow child components to consume the context.
export const UserContext = createContext<UserContextValue | undefined>(
  undefined
)

// Create a UserProvider component.
// This component maintains the current logged in user state and provides the login function.
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Create a state variable to keep track of the current user.
  // By default, it's set to null indicating no user is logged in.
  const [user, setUser] = useState<User | null>(null)

  // Create a login function.
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

  // Define the value that will be provided to all children components of UserProvider.
  const value: UserContextValue = { user, login }

  // Return a context provider with the desired value.
  // All children of this component can now access the user and login.
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
