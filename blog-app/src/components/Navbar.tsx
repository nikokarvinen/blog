import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/posts">Posts</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
