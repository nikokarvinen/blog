'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const client_1 = require('@prisma/client')
const express_1 = __importDefault(require('express'))
const routes_1 = require('./routes')
const prisma = new client_1.PrismaClient()
const router = express_1.default.Router()
// CREATE a new comment
router.post('/', routes_1.authenticateToken, (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
      where: { id: req.body.userId },
    })
    const post = yield prisma.post.findUnique({
      where: { id: req.body.postId },
    })
    // Check if user and post were found
    if (!user || !post) {
      return res.status(400).json({ error: 'User or Post not found' })
    }
    const NewAppComment = yield prisma.comment.create({
      data: {
        content: req.body.content,
        userId: user.id,
        postId: post.id,
      },
    })
    res.json(NewAppComment)
  })
)
// READ all comments
router.get('/', (_req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield prisma.comment.findMany({
      include: {
        User: true,
        Post: true,
      },
    })
    res.json(comments)
  })
)
// READ a single comment by ID
router.get('/:id', (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield prisma.comment.findUnique({
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
)
// UPDATE a comment
router.put('/:id', routes_1.authenticateToken, (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield prisma.comment.findUnique({
      where: { id: parseInt(req.params.id) },
    })
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }
    const updatedComment = yield prisma.comment.update({
      where: { id: parseInt(req.params.id) },
      data: {
        content: req.body.content,
      },
    })
    res.json(updatedComment)
  })
)
// DELETE a comment
router.delete('/:id', routes_1.authenticateToken, (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const deletedComment = yield prisma.comment.delete({
      where: { id: parseInt(req.params.id) },
    })
    res.json(deletedComment)
  })
)
exports.default = router
