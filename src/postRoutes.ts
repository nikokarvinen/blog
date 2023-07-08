import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import { authenticateToken } from './routes'

const prisma = new PrismaClient()
const router = express.Router()

// CREATE a new post
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ error: 'User not authenticated' })
    }

    // Use prisma client to create a new post in our database
    const newPost = await prisma.post.create({
      data: {
        ...req.body,
        userId: req.user.id,
      },
    })

    res.send(newPost)
  } catch (error) {
    console.error('Error creating a post:', error)
    res.status(500).json({ error: 'Failed to create a post' })
  }
})

// READ all posts
router.get('/', async (req, res) => {
  try {
    // Use prisma client to get all posts from our database
    const posts = await prisma.post.findMany({ include: { User: true } })
    res.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

// READ a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const postId = Number(req.params.id)
    // Use prisma client to get a post from our database
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { User: true },
    })

    if (post) {
      res.send(post)
    } else {
      res.status(404).send('Post not found')
    }
  } catch (error) {
    console.error('Error fetching a post:', error)
    res.status(500).json({ error: 'Failed to fetch a post' })
  }
})

// UPDATE a post
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const postId = Number(req.params.id)
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!existingPost) {
      res.status(404).send('Post not found')
      return
    }

    // Use prisma client to update a post in our database
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: req.body,
    })

    res.send(updatedPost)
  } catch (error) {
    console.error('Error updating a post:', error)
    res.status(500).json({ error: 'Failed to update a post' })
  }
})

// DELETE a post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const postId = Number(req.params.id)
    // Use prisma client to delete a post from our database
    const result = await prisma.post.delete({ where: { id: postId } })
    res.send(result)
  } catch (error) {
    console.error('Error deleting a post:', error)
    res.status(500).json({ error: 'Failed to delete a post' })
  }
})

// READ all posts by a particular user
router.get('/user/:userId/posts', async (req, res) => {
  try {
    const userId = Number(req.params.userId)
    // Use prisma client to get all posts from a specific user in our database
    const posts = await prisma.post.findMany({
      where: { userId },
    })

    res.json(posts)
  } catch (error) {
    console.error('Error fetching user posts:', error)
    res.status(500).json({ error: 'Failed to fetch user posts' })
  }
})

export default router
