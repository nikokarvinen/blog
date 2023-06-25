import express, { Request, Response } from 'express'
import { authenticateToken } from './routes'

const router = express.Router()

// CREATE a new post
router.post('/', authenticateToken, async (req, res) => {
  if (!req.app.locals.postRepository) {
    return res.status(500).json({ error: 'postRepository not initialized' })
  }

  // Check if user is set in request by authenticateToken middleware
  if (!req.user) {
    return res.status(403).json({ error: 'User not authenticated' })
  }

  // Add user to the post data
  const postData = {
    ...req.body,
    user: req.user,
  }

  const newPost = req.app.locals.postRepository.create(postData)
  const results = await req.app.locals.postRepository.save(newPost)
  res.send(results)
})

// READ all posts
router.get('/', async (req, res) => {
  if (!req.app.locals.postRepository) {
    return res.status(500).json({ error: 'postRepository not initialized' })
  }

  const posts = await req.app.locals.postRepository.find({
    relations: ['user'],
  })
  res.json(posts)
})

// READ a single post by ID
router.get('/:id', async (req, res) => {
  if (!req.app.locals.postRepository) {
    return res.status(500).json({ error: 'postRepository not initialized' })
  }

  const post = await req.app.locals.postRepository.findOne({
    where: { id: Number(req.params.id) },
  })

  if (post) {
    res.send(post)
  } else {
    res.status(404).send('Post not found')
  }
})

// UPDATE a post
router.put('/:id', async function (req: Request, res: Response) {
  if (!req.app.locals.postRepository) {
    return res.status(500).json({ error: 'postRepository not initialized' })
  }

  const post = await req.app.locals.postRepository.findOne({
    where: { id: Number(req.params.id) },
  })

  if (!post) {
    res.status(404).send('Post not found')
    return
  }

  req.app.locals.postRepository.merge(post, req.body)
  const results = await req.app.locals.postRepository.save(post)
  res.send(results)
})

// DELETE a post
router.delete('/:id', async (req, res) => {
  if (!req.app.locals.postRepository) {
    return res.status(500).json({ error: 'postRepository not initialized' })
  }

  const result = await req.app.locals.postRepository.delete(
    Number(req.params.id)
  )
  res.send(result)
})

// READ all posts by a particular user
router.get('/user/:userId/posts', async (req, res) => {
  if (!req.app.locals.postRepository) {
    return res.status(500).json({ error: 'postRepository not initialized' })
  }

  const posts = await req.app.locals.postRepository.find({
    where: { user: Number(req.params.userId) },
  })

  res.json(posts)
})

export default router
