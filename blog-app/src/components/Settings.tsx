import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'

axios.defaults.withCredentials = true

const Settings = () => {
  const navigate = useNavigate()
  const { user, logout } = useContext(UserContext)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (user) {
      setUsername(user.username)
      setEmail(user.email)
    }
  }, [user])

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/users/logout')
      logout()
      navigate('/login')
    } catch (err) {
      console.error('Failed to log out', err)
    }
  }

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updatedUser = {
        username,
        email,
        password,
      }

      await axios.put('http://localhost:3000/users/' + user?.id, updatedUser)
      setSuccessMessage('Settings updated successfully!')
      setPassword('')
    } catch (err) {
      console.error('Failed to update settings', err)
      setSuccessMessage('Failed to update settings')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Your Settings</h1>

      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}

      <form onSubmit={handleUpdateSettings}>
        <div className="mb-4">
          <label className="block text-gray-700">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">New Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Update Settings
        </button>
      </form>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  )
}

export default Settings