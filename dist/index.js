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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const commentRoute_1 = __importDefault(require("./commentRoute"));
const passport_config_1 = require("./passport-config");
const postRoutes_1 = __importDefault(require("./postRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
if (!process.env.JWT_SECRET) {
    console.error("Missing environment variable JWT_SECRET");
    process.exit(1);
}
const prisma = new client_1.PrismaClient();
process.on("exit", () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Initialize session
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
// Initialize Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/users", userRoutes_1.default);
app.use("/posts", postRoutes_1.default);
app.use("/comments", commentRoute_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        status: "error",
        message: err.message,
    });
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$connect();
        console.log("Database connection established");
        // Initialize Passport configuration
        (0, passport_config_1.initialize)(passport_1.default, (email) => __awaiter(void 0, void 0, void 0, function* () { var _a; return (_a = (yield prisma.user.findUnique({ where: { email } }))) !== null && _a !== void 0 ? _a : undefined; }), (id) => __awaiter(void 0, void 0, void 0, function* () { var _b; return (_b = (yield prisma.user.findUnique({ where: { id } }))) !== null && _b !== void 0 ? _b : undefined; }));
        app.listen(port, () => {
            console.log(`App running on http://localhost:${port}`);
        });
    }
    catch (err) {
        console.error("Failed to connect to database:", err);
        process.exit(1);
    }
});
main();
