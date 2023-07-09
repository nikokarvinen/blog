import axios from 'axios'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext' // Import UserContext

axios.defaults.withCredentials = true

const Navbar = () => {
  const { user } = useContext(UserContext) // Get user from UserContext

  return (
    <nav className="bg-gray-800" style={{ height: '60px' }}>
      <ul className="flex justify-between items-center px-5 py-3">
        <li>
          <Link
            to="/posts"
            className="text-white hover:text-gray-300 text-xl font-semibold"
            style={{ fontSize: '1.5rem' }}
          >
            Posts
          </Link>
        </li>
        {user ? ( // Check if user exists in UserContext
          <li>
            <Link
              to="/settings"
              className="text-white hover:text-gray-300 text-xl font-semibold"
              style={{ fontSize: '1.5rem' }}
            >
              {user.username}{' '}
            </Link>
          </li>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className="text-white text-xl hover:text-gray-300 font-semibold"
                style={{ fontSize: '1.5rem' }}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="text-white hover:text-gray-300 text-xl font-semibold"
                style={{ fontSize: '1.5rem' }}
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
