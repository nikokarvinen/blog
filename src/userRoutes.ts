import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { authenticateToken } from './routes'
dotenv.config()

const router = express.Router()
const secure = process.env.NODE_ENV !== 'development'

// Register
router.post('/register', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  if (!req.app.locals.userRepository) {
    return res.status(500).json({ error: 'userRepository not initialized' })
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = req.app.locals.userRepository.create({
      ...req.body,
      password: hashedPassword,
    })

    const result = await req.app.locals.userRepository.save(user)

    if (!result) {
      throw new Error('User creation failed')
    }

    const accessToken = jwt.sign(
      { id: result.id },
      process.env.JWT_SECRET || 'secret'
    )

    res.cookie('token', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure,
    }) // store token in httpOnly cookie
    res.send(result)
  } catch (error) {
    const err = error as any
    if (err.code === '23505') {
      // '23505' is the error code for unique_violation in PostgreSQL
      res.status(409).json({ error: 'An user with this email already exists.' })
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
    const user = await req.app.locals.userRepository?.findOne({
      where: { email },
    })

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
  }
)

// Logout
export const logout = (req: Request, res: Response) => {
  res.clearCookie('token') // remove the token cookie
  return res.sendStatus(204)
}

// READ all users
router.get('/', async (req, res) => {
  if (!req.userRepository) {
    return res.status(500).json({ error: 'userRepository not initialized' })
  }

  const users = await req.userRepository.find()
  res.json(users)
})

// CREATE a new user
router.post('/', async (req, res) => {
  if (!req.userRepository) {
    return res.status(500).json({ error: 'userRepository not initialized' })
  }

  const newUser = req.userRepository.create(req.body)
  const results = await req.userRepository.save(newUser)
  res.send(results)
})

// READ a single user by ID
router.get('/:id', async (req, res) => {
  if (!req.userRepository) {
    return res.status(500).json({ error: 'userRepository not initialized' })
  }

  const user = await req.userRepository.findOne({
    where: { id: Number(req.params.id) },
  })

  if (user) {
    res.send(user)
  } else {
    res.status(404).send('User not found')
  }
})

// UPDATE a user
router.put('/:id', async function (req: Request, res: Response) {
  if (!req.userRepository) {
    return res.status(500).json({ error: 'userRepository not initialized' })
  }

  const user = await req.userRepository.findOne({
    where: { id: Number(req.params.id) },
  })

  if (!user) {
    res.status(404).send('User not found')
    return
  }

  req.userRepository.merge(user, req.body)
  const results = await req.userRepository.save(user)
  res.send(results)
})

// DELETE a user
router.delete('/:id', async (req, res) => {
  if (!req.userRepository) {
    return res.status(500).json({ error: 'userRepository not initialized' })
  }

  const result = await req.userRepository.delete(Number(req.params.id))
  res.send(result)
})

export default router
