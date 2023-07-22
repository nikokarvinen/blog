import { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import {
  AppComment,
  NewAppComment,
  createComment,
  deleteComment,
  getCommentsByPostId,
  updateComment,
} from '../services/comments'
import { Post as PostData } from '../services/posts'

interface CommentsProps {
  post: PostData
  onCommentAdded: () => void
  onCommentDeleted: () => void
}

const Comments = ({
  post,
  onCommentAdded,
  onCommentDeleted,
}: CommentsProps): JSX.Element => {
  const [comments, setComments] = useState<AppComment[]>([])
  const [newCommentContent, setNewCommentContent] = useState<string>('')
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [updatedCommentContent, setUpdatedCommentContent] = useState<{
    [key: number]: string
  }>({})

  useEffect(() => {
    // Fetch comments when the post prop changes
    const fetchComments = async () => {
      if (post) {
        try {
          const postComments = await getCommentsByPostId(post.id)
          const appComments: AppComment[] = postComments.map((comment) => ({
            id: comment.id,
            postId: comment.postId,
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            User: { username: comment.User.username },
            userId: comment.userId,
          }))
          setComments(appComments)
        } catch (error) {
          const axiosError = error as AxiosError
          if (axiosError.response && axiosError.response.status === 404) {
            console.log('No comments for this post yet')
          } else {
            console.error('Error fetching comments:', error)
          }
        }
      }
    }

    fetchComments()
  }, [post])

  if (!post) {
    return <div>Loading...</div>
  }

  const handleNewCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const userString = localStorage.getItem('user')
    const user = userString ? JSON.parse(userString) : null
    const userId = user ? user.id : null

    const commentData: NewAppComment = {
      postId: post.id,
      content: newCommentContent.trim(),
      userId,
    }

    if (!commentData.content) {
      console.error('Invalid postId or empty comment content')
      return
    }

    try {
      const newComment: AppComment = await createComment(commentData)
      setComments((prevComments) => [...prevComments, newComment])
      setNewCommentContent('')
      onCommentAdded()
    } catch (err) {
      console.error(err)
    }
  }

  const handleStartEdit = (id: number, content: string) => {
    setEditingCommentId(id)
    setUpdatedCommentContent({ ...updatedCommentContent, [id]: content })
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setUpdatedCommentContent({})
  }

  const handleCommentUpdate = async (id: number) => {
    const userString = localStorage.getItem('user')
    const user = userString ? JSON.parse(userString) : null
    const userId = user ? user.id : null

    const updatedCommentData: NewAppComment = {
      postId: post.id,
      content: updatedCommentContent[id] || '',
      userId,
    }

    try {
      const updatedComment = await updateComment(id, updatedCommentData)
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id ? updatedComment : comment
        )
      )
      onCommentAdded()
    } catch (err) {
      console.error(err)
    }
  }

  const handleCommentDelete = async (id: number) => {
    try {
      await deleteComment(id)
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== id)
      )
      onCommentDeleted()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="container mx-auto my-5">
      <form
        className="flex flex-col space-y-2"
        onSubmit={handleNewCommentSubmit}
      >
        <input
          type="text"
          className="p-2 border rounded"
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder="Write a comment..."
        />
        <button className="text-blue-500 hover:underline" type="submit">
          Add Comment
        </button>
      </form>
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white shadow rounded-lg p-6 mb-4">
          <p className="text-lg">{comment.content}</p>
          <p className="text-sm text-gray-500">
            Commented by: {comment.User.username} at{' '}
            {new Date(comment.createdAt).toLocaleString()}
          </p>
          {editingCommentId === comment.id ? (
            <>
              <input
                type="text"
                className="p-2 border rounded mt-4"
                value={updatedCommentContent[comment.id] || ''}
                onChange={(e) =>
                  setUpdatedCommentContent({
                    ...updatedCommentContent,
                    [comment.id]: e.target.value,
                  })
                }
                placeholder="Edit comment..."
              />
              <div className="flex items-center justify-between mt-4">
                <div>
                  <button
                    onClick={() => handleCommentUpdate(comment.id)}
                    className="text-green-500 hover:underline mr-4"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-500 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between mt-4">
              <div>
                <button
                  onClick={() => handleStartEdit(comment.id, comment.content)}
                  className="text-yellow-500 hover:underline mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleCommentDelete(comment.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Comments
