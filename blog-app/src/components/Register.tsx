import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const { register } = useContext(UserContext)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = await register(email, password, firstName, lastName)
    if (user) {
      // Redirect to home page (or dashboard) after successful registration
      navigate('/')
    } else {
      // Show error message
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First Name:
        <input type="text" onChange={(e) => setFirstName(e.target.value)} />
      </label>
      <label>
        Last Name:
        <input type="text" onChange={(e) => setLastName(e.target.value)} />
      </label>
      <label>
        Email:
        <input type="email" onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
      </label>
      <input type="submit" value="Register" />
    </form>
  )
}

export default Register
