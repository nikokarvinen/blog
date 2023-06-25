import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_BASE_URL

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  token: string
}

export const getAllUsers = async () => {
  const response = await axios.get<User[]>(`${BASE_URL}/users`)
  return response.data
}

export const login = async (email: string, password: string) => {
  const response = await axios.post<User>(`${BASE_URL}/users/login`, {
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
