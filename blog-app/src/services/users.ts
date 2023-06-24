import axios from 'axios'

const BASE_URL = process.env.REACT_APP_BASE_URL

export const getAllUsers = async () => {
  const response = await axios.get(`${BASE_URL}/users`)
  return response.data
}

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/users/login`, {
    email,
    password,
  })
  return response.data
}

export const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const response = await axios.post(`${BASE_URL}/users/register`, {
    email,
    password,
    firstName,
    lastName,
  })
  return response.data
}
