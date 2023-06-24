import React, { useEffect, useState } from 'react'
import {
  NewComment,
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} from '../services/comments'

interface CommentProps {
  postId: number // assuming the postId is passed as a prop
}

interface CommentState extends NewComment {
  id: number
}

const Comments: React.FC<CommentProps> = ({ postId }) => {
  const [comments, setComments] = useState<CommentState[]>([])
  const [newCommentContent, setNewCommentContent] = useState<string>('')
  const [updatedCommentContent, setUpdatedCommentContent] = useState<{
    [key: number]: string
  }>({})

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getAllComments()
      setComments(fetchedComments)
    }

    fetchComments()
  }, [postId])

  const handleNewCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const commentData: NewComment = {
      postId,
      content: newCommentContent,
      author: 'Some Author', // Change this according to your actual data
    }
    await createComment(commentData)
    setNewCommentContent('')
  }

  const handleCommentUpdate = async (id: number) => {
    const updatedCommentData: NewComment = {
      postId,
      content: updatedCommentContent[id] || '',
      author: 'Some Author', // Change this according to your actual data
    }
    await updateComment(id, updatedCommentData)
  }

  const handleCommentDelete = async (id: number) => {
    await deleteComment(id)
  }

  return (
    <div>
      {/* Form to create new comment */}
      <form onSubmit={handleNewCommentSubmit}>
        <input
          type="text"
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
        />
        <button type="submit">Add Comment</button>
      </form>
      {/* List of comments */}
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          <input
            type="text"
            value={updatedCommentContent[comment.id] || ''}
            onChange={(e) =>
              setUpdatedCommentContent({
                ...updatedCommentContent,
                [comment.id]: e.target.value,
              })
            }
          />
          <button onClick={() => handleCommentUpdate(comment.id)}>
            Update Comment
          </button>
          <button onClick={() => handleCommentDelete(comment.id)}>
            Delete Comment
          </button>
        </div>
      ))}
    </div>
  )
}

export default Comments
