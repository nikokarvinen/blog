import express, { Request, Response } from 'express'
import { Post } from './entity/Post'
import { User } from './entity/User'
import { authenticateToken } from './routes'

const router = express.Router()

// CREATE a new comment
router.post('/', authenticateToken, async (req, res) => {
  if (
    !req.app.locals.commentRepository ||
    !req.app.locals.userRepository ||
    !req.app.locals.postRepository
  ) {
    return res.status(500).json({ error: 'Repository not initialized' })
  }

  const user: User = await req.app.locals.userRepository.findOne(
    req.body.userId
  )
  const post: Post = await req.app.locals.postRepository.findOne(
    req.body.postId
  )

  if (!user || !post) {
    return res.status(400).json({ error: 'User or Post not found' })
  }

  const newComment = req.app.locals.commentRepository.create({
    content: req.body.content,
    user: user,
    post: post,
  })

  const results = await req.app.locals.commentRepository.save(newComment)
  res.send(results)
})

// READ all comments
router.get('/', async (req, res) => {
  if (!req.app.locals.commentRepository) {
    return res.status(500).json({ error: 'commentRepository not initialized' })
  }

  const comments = await req.app.locals.commentRepository.find({
    relations: ['user', 'post'],
  })
  res.json(comments)
})

// READ a single comment by ID
router.get('/:id', async (req, res) => {
  if (!req.app.locals.commentRepository) {
    return res.status(500).json({ error: 'commentRepository not initialized' })
  }

  const comment = await req.app.locals.commentRepository.findOne(
    req.params.id,
    { relations: ['user', 'post'] }
  )

  if (comment) {
    res.send(comment)
  } else {
    res.status(404).send('Comment not found')
  }
})

// UPDATE a comment
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  if (!req.app.locals.commentRepository) {
    return res.status(500).json({ error: 'commentRepository not initialized' })
  }

  const comment = await req.app.locals.commentRepository.findOne(req.params.id)

  if (!comment) {
    res.status(404).send('Comment not found')
    return
  }

  comment.content = req.body.content
  const results = await req.app.locals.commentRepository.save(comment)
  res.send(results)
})

// DELETE a comment
router.delete('/:id', authenticateToken, async (req, res) => {
  if (!req.app.locals.commentRepository) {
    return res.status(500).json({ error: 'commentRepository not initialized' })
  }

  const result = await req.app.locals.commentRepository.delete(req.params.id)
  res.send(result)
})

export default router
