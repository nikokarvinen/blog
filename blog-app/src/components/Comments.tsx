import React, { useEffect, useState } from 'react'
import {
  CommentState,
  NewComment,
  createComment,
  deleteComment,
  getCommentsByPostId,
  updateComment,
} from '../services/comments'

interface CommentProps {
  postId: number
}

const Comments: React.FC<CommentProps> = ({ postId }) => {
  const [comments, setComments] = useState<CommentState[]>([])
  const [newCommentContent, setNewCommentContent] = useState<string>('')
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [updatedCommentContent, setUpdatedCommentContent] = useState<{
    [key: number]: string
  }>({})

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await getCommentsByPostId(postId)
        setComments(fetchedComments)
      } catch (err) {
        console.error(err)
      }
    }

    fetchComments()
  }, [postId])

  const handleNewCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const userString = localStorage.getItem('user')
    const user = userString ? JSON.parse(userString) : null
    const userId = user ? user.id : null

    const commentData: NewComment = {
      postId,
      content: newCommentContent,
      author: user ? user.name : 'Unknown',
      userId,
    }

    if (!postId) {
      console.error('Invalid postId')
      return
    }

    try {
      const newComment = await createComment(commentData)
      setComments((prevComments) => [...prevComments, newComment])
      setNewCommentContent('')
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

    const updatedCommentData: NewComment = {
      postId,
      content: updatedCommentContent[id] || '',
      author: user ? user.name : 'Unknown',
      userId,
    }

    try {
      const updatedComment = await updateComment(id, updatedCommentData)
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id ? updatedComment : comment
        )
      )
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
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          type="submit"
        >
          Add Comment
        </button>
      </form>
      {comments.map((comment) => (
        <div key={comment.id} className="mt-5">
          <p className="text-gray-700">{comment.content}</p>
          {editingCommentId === comment.id ? (
            <>
              <input
                type="text"
                className="p-2 border rounded"
                value={updatedCommentContent[comment.id] || ''}
                onChange={(e) =>
                  setUpdatedCommentContent({
                    ...updatedCommentContent,
                    [comment.id]: e.target.value,
                  })
                }
                placeholder="Edit comment..."
              />
              <div className="flex space-x-2 mt-2">
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded"
                  onClick={() => handleCommentUpdate(comment.id)}
                >
                  Save Comment
                </button>
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="flex space-x-2 mt-2">
              <button
                className="bg-yellow-500 text-white py-2 px-4 rounded"
                onClick={() => handleStartEdit(comment.id, comment.content)}
              >
                Edit Comment
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleCommentDelete(comment.id)}
              >
                Delete Comment
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Comments
