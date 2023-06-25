import React, { useEffect, useState } from 'react'
import {
  NewComment,
  createComment,
  deleteComment,
  updateComment,
} from '../services/comments'

interface CommentProps {
  comments: CommentState[]
}

interface CommentState extends NewComment {
  id: number
}

const Comments: React.FC<CommentProps> = ({ comments: commentProps }) => {
  const [comments, setComments] = useState<CommentState[]>([])
  const [newCommentContent, setNewCommentContent] = useState<string>('')
  const [updatedCommentContent, setUpdatedCommentContent] = useState<{
    [key: number]: string
  }>({})

  useEffect(() => {
    setComments(commentProps)
  }, [commentProps])

  const handleNewCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const commentData: NewComment = {
      postId: comments[0]?.postId,
      content: newCommentContent,
      author: 'Some Author',
    }
    await createComment(commentData)
    setNewCommentContent('')
  }

  const handleCommentUpdate = async (id: number) => {
    const updatedCommentData: NewComment = {
      postId: comments[0]?.postId,
      content: updatedCommentContent[id] || '',
      author: 'Some Author',
    }
    await updateComment(id, updatedCommentData)
  }

  const handleCommentDelete = async (id: number) => {
    await deleteComment(id)
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
              Update Comment
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => handleCommentDelete(comment.id)}
            >
              Delete Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Comments
