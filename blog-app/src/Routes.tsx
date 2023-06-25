import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Post from './components/Post'
import Register from './components/Register'
import User from './components/User'

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/posts" element={<Post />} />
      <Route path="/users" element={<User />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/posts" />} />
    </Routes>
  )
}

export default RoutesComponent
