import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_BASE_URL

export interface Post {
  id: number
  title: string
  content: string
}

export const getAllPosts = async () => {
  const response = await axios.get<Post[]>(`${BASE_URL}/posts`)
  return response.data
}

export const createPost = async (post: Post) => {
  const response = await axios.post<Post>(`${BASE_URL}/posts`, post)
  return response.data
}

export const updatePost = async (id: number, updatedPost: Post) => {
  const response = await axios.put<Post>(`${BASE_URL}/posts/${id}`, updatedPost)
  return response.data
}

export const deletePost = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/posts/${id}`)
  return response.data
}
