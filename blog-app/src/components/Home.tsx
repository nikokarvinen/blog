import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Post as PostData, deletePost, getAllPosts } from '../services/posts'
import Comments from './Comments'

const Home = () => {
  type PostWithCommentCount = PostData & { commentCount: number }
  const [posts, setPosts] = useState<PostWithCommentCount[]>([])
  const [activePosts, setActivePosts] = useState<{ [id: number]: boolean }>({})

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
      <h1 className="text-4xl font-bold mb-4 text-center mt-8">Home</h1>
      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">
              Posted by: {post.User?.username} | Created on:{' '}
              {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-2">
            <Link
              to={`/posts/${post.id}`}
              className="text-blue-500 hover:underline"
            >
              {post.title}
            </Link>
          </h2>
          <p className="text-lg">{post.content}</p>
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => handleDeletePost(post.id)}
              className="text-red-500 hover:underline mr-4"
            >
              Delete
            </button>
            <button
              onClick={() => handleToggleComments(post)}
              className="text-blue-500 hover:underline"
            >
              {post.commentCount + ' Comments'}
            </button>
            <div style={{ display: activePosts[post.id] ? 'block' : 'none' }}>
              <Comments
                post={post}
                onCommentAdded={() => onCommentAdded(post.id)}
                onCommentDeleted={() => onCommentDeleted(post.id)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Home
