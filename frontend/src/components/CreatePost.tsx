import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PostInput, createPost } from '../services/posts'

const Post = () => {
  const [newPost, setNewPost] = useState<PostInput>({ title: '', content: '' })
  const [isCreating, setIsCreating] = useState<boolean>(false)

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      toast.error('Please fill in both the title and content')
      return
    }

    setIsCreating(true)
    try {
      const createdPost = await createPost(newPost)
      setNewPost({ title: '', content: '' })
      toast.success(`Post "${createdPost.title}" created successfully`)
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error(
        'An error occurred while creating the post. Please try again.'
      )
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8">
      <h1 className="text-5xl font-bold mb-10">Create New Post</h1>
      <div className="mb-4 w-full max-w-md">
        <input
          type="text"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          placeholder="Post title"
          className="block w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <textarea
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          placeholder="Post content"
          className="block w-full mb-4 p-2 border border-gray-300 rounded"
          rows={4}
        />
        <button
          onClick={handleCreatePost}
          disabled={isCreating}
          className={`w-full py-2 px-4 rounded bg-blue-500 text-white ${
            isCreating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          {isCreating ? 'Creating Post...' : 'Create Post'}
        </button>
      </div>
      <ToastContainer />
    </div>
  )
}
export default Post
