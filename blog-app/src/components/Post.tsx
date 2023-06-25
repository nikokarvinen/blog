import { useEffect, useState } from 'react'
import { getAllComments } from '../services/comments'
import { Post as PostData, getAllPosts } from '../services/posts'
import Comments from './Comments'

interface Comment {
  id: number
  content: string
  postId: number
  author: string
}

const Post = () => {
  const [posts, setPosts] = useState<PostData[]>([])
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
