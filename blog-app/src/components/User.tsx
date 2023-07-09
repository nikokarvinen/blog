import { useEffect, useState } from 'react'
import {
  User as UserData,
  deleteUser,
  getAllUsers,
  login,
} from '../services/users'

export interface User {
  id: number
  username: string
  email: string
}

const User = () => {
  const [users, setUsers] = useState<UserData[]>([])
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)

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

  const handleDeleteUser = async (userId: number) => {
    await deleteUser(userId)
    const updatedUsers = users.filter((user) => user.id !== userId)
    setUsers(updatedUsers)
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4">User</h1>
      {loggedInUser ? (
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">{loggedInUser.username}</h2>
          <p className="text-sm">{loggedInUser.email}</p>
          <button
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleLogin}
        >
          Login
        </button>
      )}
      {users.map((user) => (
        <div key={user.id} className="mb-4">
          <h2 className="text-xl font-semibold">{user.username}</h2>
          <p className="text-sm">{user.email}</p>
          {loggedInUser && loggedInUser.id !== user.id && (
            <button
              className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleDeleteUser(user.id)}
            >
              Delete User
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default User
