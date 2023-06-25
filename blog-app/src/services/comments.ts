import axios from 'axios'

axios.defaults.withCredentials = true

const BASE_URL = import.meta.env.VITE_APP_BASE_URL

export interface Comment {
  id: number
  postId: number
  content: string
  author: string
}

export interface NewComment {
  postId: number
  content: string
  author: string
}

export const getAllComments = async () => {
  const response = await axios.get<Comment[]>(`${BASE_URL}/comments`)
  return response.data
}

export const createComment = async (comment: NewComment) => {
  const response = await axios.post<Comment>(`${BASE_URL}/comments`, comment)
  return response.data
}

export const updateComment = async (id: number, updatedComment: NewComment) => {
  const response = await axios.put<Comment>(
    `${BASE_URL}/comments/${id}`,
    updatedComment
  )
  return response.data
}

export const deleteComment = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/comments/${id}`)
  return response.data
}
