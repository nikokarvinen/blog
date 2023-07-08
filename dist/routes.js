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
exports.authenticateToken = exports.attachRepositories = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Initialize prisma client
const prisma = new client_1.PrismaClient();
// Middleware to attach repositories to the request object
const attachRepositories = (req, res, next) => {
    req.userRepository = prisma.user;
    req.postRepository = prisma.post;
    next();
};
exports.attachRepositories = attachRepositories;
// Middleware to authenticate the JWT token
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (token == null)
        return res.sendStatus(401);
    // Verify the JWT
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret", (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.sendStatus(403);
        if (!user) {
            return res.status(500).json({
                error: "User in JWT is not defined",
            });
        }
        try {
            // Fetch the full user data using the user id from JWT
            const fullUser = yield prisma.user.findUnique({
                where: { id: user.id },
            });
            if (!fullUser)
                return res.sendStatus(403);
            req.user = fullUser;
            next();
        }
        catch (error) {
            console.error("Error fetching user:", error);
            res.sendStatus(500);
        }
    }));
};
exports.authenticateToken = authenticateToken;
