import { useEffect, useState } from 'react'
import { getAllComments } from '../services/comments'
import { getAllPosts } from '../services/posts'
import Comments from './Comments'

interface Post {
  id: number
  title: string
  content: string
}

interface Comment {
  id: number
  content: string
  postId: number
}

const Post = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])

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

  return (
    <div>
      <h1>Post</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <Comments
            comments={comments.filter((comment) => comment.postId === post.id)}
          />
        </div>
      ))}
    </div>
  )
}

export default Post
