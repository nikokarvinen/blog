import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { authenticateToken } from './routes'

dotenv.config()

const prisma = new PrismaClient()
const router = express.Router()
const secure = process.env.NODE_ENV !== 'development'

// Register
router.post('/register', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
      },
    })

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'secret'
    )

    res.cookie('token', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure,
    }) // store token in httpOnly cookie
    res.send(user)
  } catch (error) {
    const err = error as any
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'A user with this email already exists.' })
    } else {
      res
        .status(500)
        .json({ error: 'An error occurred while creating the user' })
    }
  }
})

// Login
router.post(
  '/login',
  authenticateToken,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
      const user = await prisma.user.findUnique({ where: { email } })

      if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET || 'secret'
        )

        res.cookie('token', accessToken, {
          httpOnly: true,
          sameSite: 'none',
          secure,
        }) // store token in httpOnly cookie
        return res.json(user)
      } else {
        return res.status(400).json({ error: 'Email or password is incorrect' })
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      res.sendStatus(500)
    }
  }
)

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Failed to destroy session:', err)
      res.status(500).json({ error: 'Failed to log out' })
    } else {
      res.clearCookie('session_id') // Clear the session cookie
      res.sendStatus(200)
    }
  })
})

// READ all users
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

// CREATE a new user
router.post('/', async (req, res) => {
  const newUser = await prisma.user.create({
    data: req.body,
  })
  res.send(newUser)
})

// READ a single user by ID
router.get('/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  })

  if (user) {
    res.send(user)
  } else {
    res.status(404).send('User not found')
  }
})

// UPDATE a user
router.put('/:id', async (req: Request, res: Response) => {
  const userId = Number(req.params.id)
  const { firstName, lastName, email, password } = req.body as {
    firstName: string
    lastName: string
    email: string
    password?: string // Make the password field optional
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      return res.status(404).send('User not found')
    }

    let updatedUserData: {
      firstName: string
      lastName: string
      email: string
      password?: string // Update the type annotation to include the optional password field
    } = {
      firstName,
      lastName,
      email,
    }

    // Check if the password field is included in the request payload
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updatedUserData = {
        ...updatedUserData,
        password: hashedPassword,
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedUserData,
    })

    res.send(updatedUser)
  } catch (error) {
    console.error('Failed to update user:', error)
    res.sendStatus(500)
  }
})

// DELETE a user
router.delete('/:id', async (req, res) => {
  await prisma.user.delete({
    where: { id: Number(req.params.id) },
  })

  res.sendStatus(204)
})

export default router
