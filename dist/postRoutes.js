"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
// CREATE a new post
router.post("/", routes_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(403).json({ error: "User not authenticated" });
        }
        // Use prisma client to create a new post in our database
        const newPost = yield prisma.post.create({
            data: Object.assign(Object.assign({}, req.body), { userId: req.user.id }),
        });
        res.send(newPost);
    }
    catch (error) {
        console.error("Error creating a post:", error);
        res.status(500).json({ error: "Failed to create a post" });
    }
}));
// READ all posts
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use prisma client to get all posts from our database
        const posts = yield prisma.post.findMany({ include: { User: true } });
        res.json(posts);
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
}));
// READ a single post by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = Number(req.params.id);
        // Use prisma client to get a post from our database
        const post = yield prisma.post.findUnique({
            where: { id: postId },
            include: { User: true },
        });
        if (post) {
            res.send(post);
        }
        else {
            res.status(404).send("Post not found");
        }
    }
    catch (error) {
        console.error("Error fetching a post:", error);
        res.status(500).json({ error: "Failed to fetch a post" });
    }
}));
// UPDATE a post
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = Number(req.params.id);
        const existingPost = yield prisma.post.findUnique({
            where: { id: postId },
        });
        if (!existingPost) {
            res.status(404).send("Post not found");
            return;
        }
        // Use prisma client to update a post in our database
        const updatedPost = yield prisma.post.update({
            where: { id: postId },
            data: req.body,
        });
        res.send(updatedPost);
    }
    catch (error) {
        console.error("Error updating a post:", error);
        res.status(500).json({ error: "Failed to update a post" });
    }
}));
// DELETE a post
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = Number(req.params.id);
        // Use prisma client to delete a post from our database
        const result = yield prisma.post.delete({ where: { id: postId } });
        res.send(result);
    }
    catch (error) {
        console.error("Error deleting a post:", error);
        res.status(500).json({ error: "Failed to delete a post" });
    }
}));
// READ all posts by a particular user
router.get("/user/:userId/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.userId);
        // Use prisma client to get all posts from a specific user in our database
        const posts = yield prisma.post.findMany({
            where: { userId },
        });
        res.json(posts);
    }
    catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({ error: "Failed to fetch user posts" });
    }
}));
exports.default = router;
