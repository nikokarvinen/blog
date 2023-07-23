import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/useUser'
import {
  Post as PostData,
  PostInput,
  deletePost,
  getAllPosts,
  updatePost,
} from '../services/posts'
import Comments from './Comments'

const Home = () => {
  const { user } = useUser()
  type PostWithCommentCount = PostData & { commentCount: number }
  const [posts, setPosts] = useState<PostWithCommentCount[]>([])
  const [activePosts, setActivePosts] = useState<{ [id: number]: boolean }>({})
  const [editPostId, setEditPostId] = useState<null | number>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    fetchPosts()
  }, [])

  const handleToggleComments = (post: PostData) => {
    setActivePosts((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
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
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id))
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const onCommentAdded = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, commentCount: post.commentCount + 1 }
          : post
      )
    )
  }

  const onCommentDeleted = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, commentCount: post.commentCount - 1 }
          : post
      )
    )
  }

  return (
    <div className="container mx-auto px-6">
      <h1 className="text-5xl font-bold mb-10 text-center mt-8">Home</h1>
      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow-md rounded-lg p-6 mb-10">
          {editPostId === post.id ? (
            <div>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Post title"
                className="block w-full mb-2 p-2 border border-gray-300 rounded"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Post content"
                className="block w-full mb-2 p-2 border border-gray-300 rounded"
                rows={4}
              />
              <button
                onClick={() => handleUpdatePost(post.id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-500">
                  Posted by: {post.User?.username} | Created on:{' '}
                  {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
              <h2 className="text-3xl font-semibold mb-2">
                <Link
                  to={`/posts/${post.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-lg">{post.content}</p>
              <div className="flex items-center justify-between mt-6">
                {user?.id === post.User?.id && (
                  <>
                    <button
                      onClick={() => {
                        setEditTitle(post.title)
                        setEditContent(post.content)
                        setEditPostId(post.id)
                      }}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-500 hover:text-red-700 mr-4"
                    >
                      Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleToggleComments(post)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {post.commentCount + ' Comments'}
                </button>
              </div>
            </>
          )}
          <div style={{ display: activePosts[post.id] ? 'block' : 'none' }}>
            <Comments
              post={post}
              onCommentAdded={() => onCommentAdded(post.id)}
              onCommentDeleted={() => onCommentDeleted(post.id)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Home
