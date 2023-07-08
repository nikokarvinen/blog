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
exports.logout = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const routes_1 = require("./routes");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
const secure = process.env.NODE_ENV !== "development";
// Register
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        const user = yield prisma.user.create({
            data: Object.assign(Object.assign({}, req.body), { password: hashedPassword }),
        });
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || "secret");
        res.cookie("token", accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure,
        }); // store token in httpOnly cookie
        res.send(user);
    }
    catch (error) {
        const err = error;
        if (err.code === "P2002") {
            res.status(409).json({ error: "A user with this email already exists." });
        }
        else {
            res
                .status(500)
                .json({ error: "An error occurred while creating the user" });
        }
    }
}));
// Login
router.post("/login", routes_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (user && (yield bcrypt_1.default.compare(password, user.password))) {
            const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || "secret");
            res.cookie("token", accessToken, {
                httpOnly: true,
                sameSite: "none",
                secure,
            }); // store token in httpOnly cookie
            return res.json(user);
        }
        else {
            return res
                .status(400)
                .json({ error: "Email or password is incorrect" });
        }
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.sendStatus(500);
    }
}));
// Logout
const logout = (req, res) => {
    res.clearCookie("token"); // remove the token cookie
    return res.sendStatus(204);
};
exports.logout = logout;
// READ all users
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany();
    res.json(users);
}));
// CREATE a new user
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield prisma.user.create({
        data: req.body,
    });
    res.send(newUser);
}));
// READ a single user by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: { id: Number(req.params.id) },
    });
    if (user) {
        res.send(user);
    }
    else {
        res.status(404).send("User not found");
    }
}));
// UPDATE a user
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: { id: Number(req.params.id) },
    });
    if (!user) {
        res.status(404).send("User not found");
        return;
    }
    const updatedUser = yield prisma.user.update({
        where: { id: Number(req.params.id) },
        data: req.body,
    });
    res.send(updatedUser);
}));
// DELETE a user
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.delete({
        where: { id: Number(req.params.id) },
    });
    res.sendStatus(204);
}));
exports.default = router;
