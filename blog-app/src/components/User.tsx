import { useEffect, useState } from 'react'
import { getAllUsers } from '../services/users'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
}

const User = () => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers()
      setUsers(data)
    }

    fetchUsers()
  }, [])

  return (
    <div>
      <h1>User</h1>
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
