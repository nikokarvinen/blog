import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Post from './components/Post'
import Register from './components/Register'
import User from './components/User'

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Post />} />
      <Route path="/users" element={<User />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default RoutesComponent
