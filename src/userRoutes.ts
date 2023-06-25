import bcrypt from 'bcrypt'
import express, { Request, Response } from 'express'

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  if (!req.userRepository) {
    return res.status(500).json({ error: 'userRepository not initialized' })
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = req.userRepository.create({
      ...req.body,
      password: hashedPassword,
    })

    const results = await req.userRepository.save(user)
    res.send(results)
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
router.post('/login', async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  if (!req.userRepository) {
    return res.status(500).json({ error: 'userRepository not initialized' })
  }

  try {
    const user = await req.userRepository.findOne({
      where: { email: req.body.email },
    })

    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    const isValid = await bcrypt.compare(req.body.password, user.password)

    if (!isValid) {
      return res.status(400).json({ error: 'Incorrect password' })
    }

    return res.json({ user: user.toAuthJSON() })
  } catch (err) {
    return res.status(500).json({ error: 'An error occurred while logging in' })
  }
})

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.sendStatus(200)
})

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
