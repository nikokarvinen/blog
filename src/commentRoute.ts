import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import { authenticateToken } from './routes'

const prisma = new PrismaClient()

const router = express.Router()

// CREATE a new comment
router.post('/', authenticateToken, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.body.userId } })
  const post = await prisma.post.findUnique({ where: { id: req.body.postId } })

  // Check if user and post were found
  if (!user || !post) {
    return res.status(400).json({ error: 'User or Post not found' })
  }

  const NewAppComment = await prisma.comment.create({
    data: {
      content: req.body.content,
      userId: user.id,
      postId: post.id,
    },
    include: {
      User: true,
    },
  })

  res.json(NewAppComment)
})

// READ all comments
router.get('/', async (_req, res) => {
  const comments = await prisma.comment.findMany({
    include: {
      User: true,
      Post: true,
    },
  })

  res.json(comments)
})

// READ all comments for a specific post
router.get('/posts/:postId/comments', async (req, res) => {
  const postId = parseInt(req.params.postId)

  const comments = await prisma.comment.findMany({
    where: {
      postId: postId,
    },
    include: {
      User: true,
    },
  })

  if (comments.length > 0) {
    res.json(comments)
  } else {
    res.status(200).json([])
  }
})

// READ a single comment by ID
router.get('/:id', async (req, res) => {
  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      User: true,
      Post: true,
    },
  })

  if (comment) {
    res.json(comment)
  } else {
    res.status(404).json({ error: 'Comment not found' })
  }
})

// UPDATE a comment
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(req.params.id) },
  })

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' })
  }

  const updatedComment = await prisma.comment.update({
    where: { id: parseInt(req.params.id) },
    data: {
      content: req.body.content,
    },
    include: {
      User: true,
    },
  })

  res.json(updatedComment)
})

// DELETE a comment
router.delete('/:id', authenticateToken, async (req, res) => {
  const deletedComment = await prisma.comment.delete({
    where: { id: parseInt(req.params.id) },
  })

  res.json(deletedComment)
})

export default router
