import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(UserContext)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = await login(email, password)
    if (user) {
      // Redirect to home page (or dashboard) after login
      navigate('/')
    } else {
      // Show error message
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
      </label>
      <input type="submit" value="Login" />
    </form>
  )
}

export default Login
