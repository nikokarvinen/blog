import axios, { AxiosError } from "axios";

axios.defaults.withCredentials = true;

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get<User[]>(`${BASE_URL}/users`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Error getting users:", axiosError.message);
      throw axiosError;
    }
    console.error("Unknown error occurred while getting users");
    throw error;
  }
};

// Login
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post<User>(`${BASE_URL}/users/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Error logging in:", axiosError.message);
      throw axiosError;
    }
    console.error("Unknown error occurred while logging in");
    throw error;
  }
};

// Register
export const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/register`, {
      email,
      password,
      firstName,
      lastName,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Error registering user:", axiosError.message);
      throw axiosError;
    }
    console.error("Unknown error occurred while registering user");
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId: number) => {
  try {
    await axios.delete(`${BASE_URL}/users/${userId}`);
    console.log("User deleted successfully.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Error deleting user:", axiosError.message);
      throw axiosError;
    }
    console.error("Unknown error occurred while deleting user");
    throw error;
  }
};
