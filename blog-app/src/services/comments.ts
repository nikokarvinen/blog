import axios from 'axios'

axios.defaults.withCredentials = true

const BASE_URL = import.meta.env.VITE_APP_BASE_URL

export interface NewAppComment {
  postId: number
  content: string
  userId: number | null
}

export interface CommentState extends NewAppComment {
  id: number
  createdAt: string
  updatedAt: string
  User: {
    username: string
  }
}

export interface AppComment extends CommentState {
  User: {
    username: string
  }
}

export const getAllComments = async () => {
  const response = await axios.get<AppComment[]>(`${BASE_URL}/comments`)
  return response.data
}

export async function createComment(data: NewAppComment): Promise<AppComment> {
  const response = await axios.post<AppComment>(`${BASE_URL}/comments`, data)
  return response.data
}

export async function updateComment(
  id: number,
  data: NewAppComment
): Promise<AppComment> {
  const response = await axios.put<AppComment>(
    `${BASE_URL}/comments/${id}`,
    data
  )
  return response.data
}

export const getCommentsByPostId = async (
  postId: number
): Promise<CommentState[]> => {
  const response = await axios.get<CommentState[]>(
    `${BASE_URL}/comments/posts/${postId}/comments`
  )
  return response.data
}

export const deleteComment = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/comments/${id}`)
  return response.data
}
