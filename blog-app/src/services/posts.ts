import axios from 'axios'
import { User } from './users'

axios.defaults.withCredentials = true

const BASE_URL = import.meta.env.VITE_APP_BASE_URL

export interface PostWithCommentCount extends Post {
  commentCount: number
}

export interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  User?: User
  Comments?: Comment[]
  commentCount: number
}

export interface Comment {
  id: number
  postId: number
  content: string
  userId: number | null
  createdAt: string
  updatedAt: string
  User: User
}

export interface PostInput {
  title: string
  content: string
}

export const getAllPosts = async () => {
  const response = await axios.get<PostWithCommentCount[]>(`${BASE_URL}/posts`)
  return response.data
}

export const createPost = async (post: PostInput) => {
  const response = await axios.post<Post>(`${BASE_URL}/posts`, post)
  return response.data
}

export const updatePost = async (id: number, updatedPost: PostInput) => {
  const response = await axios.put<Post>(`${BASE_URL}/posts/${id}`, updatedPost)
  return response.data
}

export const deletePost = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/posts/${id}`)
  return response.data
}
