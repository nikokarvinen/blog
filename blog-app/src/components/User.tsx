import { useEffect, useState } from 'react'
import { User as UserData, getAllUsers, login } from '../services/users'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
}

const User = () => {
  const [users, setUsers] = useState<UserData[]>([])
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers()
      setUsers(data)
    }

    fetchUsers()
  }, [])

  const handleLogin = async () => {
    const email = prompt('Enter email')
    const password = prompt('Enter password')

    if (email && password) {
      const user = await login(email, password)
      setLoggedInUser(user)
    }
  }

  const handleLogout = () => {
    setLoggedInUser(null)
  }

  return (
    <div>
      <h1>User</h1>
      {loggedInUser ? (
        <div>
          <h2>
            {loggedInUser.firstName} {loggedInUser.lastName}
          </h2>
          <p>{loggedInUser.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
      {users.map((user) => (
        <div key={user.id}>
          <h2>
            {user.firstName} {user.lastName}
          </h2>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  )
}

export default User
