import axios from "axios";

axios.defaults.withCredentials = true;

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export interface Post {
  id: number;
  title: string;
  content: string;
  user: User;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  id: number;
}

export interface PostInput {
  title: string;
  content: string;
}

export const getAllPosts = async () => {
  const response = await axios.get<Post[]>(`${BASE_URL}/posts`);
  return response.data;
};

export const createPost = async (post: PostInput) => {
  const response = await axios.post<Post>(`${BASE_URL}/posts`, post);
  return response.data;
};

export const updatePost = async (id: number, updatedPost: PostInput) => {
  const response = await axios.put<Post>(
    `${BASE_URL}/posts/${id}`,
    updatedPost,
  );
  return response.data;
};

export const deletePost = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/posts/${id}`);
  return response.data;
};
