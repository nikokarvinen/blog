import { useEffect, useState } from 'react'
import { getAllComments } from '../services/comments'
import {
  Post as PostData,
  PostInput,
  createPost,
  deletePost,
  getAllPosts,
  updatePost,
} from '../services/posts'
import Comments from './Comments'

interface Comment {
  id: number
  content: string
  postId: number
  author: string
}

const Post = () => {
  const [posts, setPosts] = useState<PostData[]>([])
  const [newPost, setNewPost] = useState<PostInput>({ title: '', content: '' })
  const [comments, setComments] = useState<Comment[]>([])
  const [editPostId, setEditPostId] = useState<null | number>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getAllPosts()
      setPosts(data)
    }

    const fetchComments = async () => {
      const data = await getAllComments()
      setComments(data)
    }

    fetchPosts()
    fetchComments()
  }, [])

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      return
    }

    const createdPost = await createPost(newPost)
    setPosts([createdPost, ...posts])
    setNewPost({ title: '', content: '' })
  }

  const handleUpdatePost = async (id: number) => {
    const updatedPost: PostInput = {
      title: editTitle,
      content: editContent,
    }

    const updated = await updatePost(id, updatedPost)
    setPosts(posts.map((post) => (post.id === id ? updated : post)))
    setEditPostId(null)
    setEditTitle('')
    setEditContent('')
  }

  const handleDeletePost = async (id: number) => {
    await deletePost(id)
    setPosts(posts.filter((post) => post.id !== id))
  }

  return (
    <div>
      <h1>Post</h1>
      <div>
        <input
          type="text"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          placeholder="Post title"
        />
        <textarea
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          placeholder="Post content"
        />
        <button onClick={handleCreatePost}>Create Post</button>
      </div>
      {posts.map((post) => (
        <div key={post.id}>
          {editPostId === post.id ? (
            <div>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Post title"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Post content"
              />
              <button onClick={() => handleUpdatePost(post.id)}>
                Update Post
              </button>
            </div>
          ) : (
            <div>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p>
                Posted by: {post.user.firstName} {post.user.lastName}
              </p>{' '}
              {/* Display the user who created the post */}
              <button
                onClick={() => {
                  setEditPostId(post.id)
                  setEditTitle(post.title)
                  setEditContent(post.content)
                }}
              >
                Edit
              </button>
              <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            </div>
          )}
          <Comments
            comments={comments.filter((comment) => comment.postId === post.id)}
          />
        </div>
      ))}
    </div>
  )
}

export default Post
