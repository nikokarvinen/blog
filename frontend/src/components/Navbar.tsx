import { faBlog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/useUser'

axios.defaults.withCredentials = true

const Navbar = () => {
  const { user } = useUser()

  return (
    <nav className="bg-gray-900 text-white py-4 shadow-md">
      <ul className="flex justify-between items-center px-10">
        <li>
          <Link
            to="/"
            className="text-2xl font-bold tracking-widest text-white hover:text-gray-200 flex items-center"
          >
            Blogify <FontAwesomeIcon icon={faBlog} className="ml-2" />
          </Link>
        </li>
        <div className="space-x-6">
          {user && (
            <li>
              <Link to="/create-post" className="text-lg hover:text-gray-200">
                Create Post
              </Link>
            </li>
          )}
          {user ? (
            <li>
              <Link to="/settings" className="text-lg hover:text-gray-200">
                {user.username}
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-lg hover:text-gray-200">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-lg hover:text-gray-200">
                  Register
                </Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  )
}

export default Navbar
