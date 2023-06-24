import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Comment from './components/Comments'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Post from './components/Post'
import Register from './components/Register'
import User from './components/User'
import { UserProvider } from './contexts/UserContext'

const App = () => {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path="/posts" element={<Post />} />
          <Route path="/users" element={<User />} />
          <Route path="/comments" element={<Comment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </UserProvider>
    </Router>
  )
}

export default App
