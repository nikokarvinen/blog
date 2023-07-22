import { useCallback, useEffect, useState } from 'react'
import {
  Post as PostData,
  PostInput,
  createPost,
  deletePost,
  getAllPosts,
  updatePost,
} from '../services/posts'
import Comments from './Comments'

const Post = () => {
  const [posts, setPosts] = useState<PostData[]>([])
  const [newPost, setNewPost] = useState<PostInput>({ title: '', content: '' })
  const [editPostId, setEditPostId] = useState<null | number>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  const fetchPosts = useCallback(async () => {
    try {
      const data = await getAllPosts()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      return
    }

    try {
      const createdPost = await createPost(newPost)
      setPosts([createdPost, ...posts])
      setNewPost({ title: '', content: '' })
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const handleUpdatePost = async (id: number) => {
    const updatedPost: PostInput = {
      title: editTitle,
      content: editContent,
    }

    try {
      const updated = await updatePost(id, updatedPost)
      setPosts(posts.map((post) => (post.id === id ? updated : post)))
      setEditPostId(null)
      setEditTitle('')
      setEditContent('')
    } catch (error) {
      console.error('Error updating post:', error)
    }
  }

  const handleDeletePost = async (id: number) => {
    try {
      await deletePost(id)
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4 pt-6">Post</h1>
      <div className="mb-4 w-full max-w-md">
        <input
          type="text"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          placeholder="Post title"
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2 w-full"
        />
        <textarea
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          placeholder="Post content"
          className="border border-gray-300 px-4 py-2 rounded-lg w-full"
          rows={4}
        />
        <button
          onClick={handleCreatePost}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 w-full"
        >
          Create Post
        </button>
      </div>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <button onClick={() => handleDeletePost(post.id)}>Delete</button>
          <button onClick={() => setEditPostId(post.id)}>Edit</button>
          {editPostId === post.id && (
            <div>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <button onClick={() => handleUpdatePost(post.id)}>Save</button>
            </div>
          )}
          <Comments post={post} onCommentAdded={fetchPosts} />
        </div>
      ))}
    </div>
  )
}
export default Post
