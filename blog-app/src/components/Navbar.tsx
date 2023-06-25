import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User } from './User'

const Navbar = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)

  const BASE_URL = 'http://localhost:3000' // replace with your server's URL

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/users/logout`)
      setLoggedInUser(null)
    } catch (err) {
      console.error('Failed to log out', err)
    }
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to="/posts">Posts</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        {loggedInUser ? (
          <>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
            <li>
              Welcome, {loggedInUser.firstName} {loggedInUser.lastName}
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
