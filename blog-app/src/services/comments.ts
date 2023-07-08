import axios from "axios";

axios.defaults.withCredentials = true;

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export interface CommentState extends NewComment {
  id: number;
}

export interface Comment {
  id: number;
  postId: number;
  content: string;
  author: string;
}

export interface NewComment {
  postId: number;
  content: string;
  author: string;
  userId: number;
}

export const getAllComments = async () => {
  const response = await axios.get<Comment[]>(`${BASE_URL}/comments`);
  return response.data;
};

export const createComment = async (comment: NewComment) => {
  const response = await axios.post<CommentState>(
    `${BASE_URL}/comments`,
    comment,
  );
  return response.data;
};

export const updateComment = async (id: number, updatedComment: NewComment) => {
  const response = await axios.put<CommentState>(
    `${BASE_URL}/comments/${id}`,
    updatedComment,
  );
  return response.data;
};

export const getCommentsByPostId = async (postId: number) => {
  const response = await axios.get<CommentState[]>(
    `${BASE_URL}/posts/${postId}/comments`,
  );
  return response.data;
};

export const deleteComment = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/comments/${id}`);
  return response.data;
};
