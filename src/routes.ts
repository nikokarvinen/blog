import bcrypt from 'bcrypt'
import express, { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import { Repository } from 'typeorm'
import { User } from './entity/User'

declare module 'express-serve-static-core' {
  interface Request {
    userRepository?: Repository<User>
  }
}

const router = express.Router()

// Middleware to attach repositories to request object
router.use((req: Request, res: Response, next: NextFunction) => {
  req.userRepository = req.app.locals.userRepository
  next()
})

// Register
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
  } catch {
    res.redirect('/register')
  }
})

// Login
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
)

// READ all users
router.get('/users', async (req, res) => {
  if (!req.userRepository) {
    return res.status(500).json({ error: 'userRepository not initialized' })
  }

  const users = await req.userRepository.find()
  res.json(users)
})

// CREATE a new user
router.post('/users', async (req, res) => {
  if (!req.userRepository) {
    return res.status(500).json({ error: 'userRepository not initialized' })
  }

  const newUser = req.userRepository.create(req.body)
  const results = await req.userRepository.save(newUser)
  res.send(results)
})

// READ a single user by ID
router.get('/users/:id', async (req, res) => {
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
router.put('/users/:id', async function (req: Request, res: Response) {
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
router.delete('/users/:id', async (req, res) => {
  if (!req.userRepository) {
    return res.status(500).json({ error: 'userRepository not initialized' })
  }

  const result = await req.userRepository.delete(Number(req.params.id))
  res.send(result)
})

export default router
