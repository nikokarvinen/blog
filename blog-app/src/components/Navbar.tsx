import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User } from './User'

axios.defaults.withCredentials = true

const Navbar = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)

  const BASE_URL = 'http://localhost:3000'

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/users/logout`)
      setLoggedInUser(null)
    } catch (err) {
      console.error('Failed to log out', err)
    }
  }

  return (
    <nav className="bg-gray-800" style={{height: '60px'}}>
      <ul className="flex justify-between items-center px-5 py-3">
        <li>
          <Link
            to="/posts"
            className="text-white hover:text-gray-300 text-xl font-semibold" style={{fontSize: '1.5rem'}}
          >
            Posts
          </Link>
        </li>
        <li>
          <Link
            to="/users"
            className="text-white hover:text-gray-300 text-xl font-semibold" style={{fontSize: '1.5rem'}}
          >
            Users
          </Link>
        </li>
        {loggedInUser ? (
          <>
            <li>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300 text-xl font-semibold" 
              >
                Logout
              </button>
            </li>
            <li className="text-white">
              Welcome, {loggedInUser.firstName} {loggedInUser.lastName}
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className="text-white hover:text-gray-300 text-xl font-semibold" style={{fontSize: '1.5rem'}}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="text-white hover:text-gray-300 text-xl font-semibold" style={{fontSize: '1.5rem'}}
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
