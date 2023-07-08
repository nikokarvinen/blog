import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import commentRoutes from "./commentRoute";
import { initialize } from "./passport-config";
import postRoutes from "./postRoutes";
import userRoutes from "./userRoutes";

if (!process.env.JWT_SECRET) {
  console.error("Missing environment variable JWT_SECRET");
  process.exit(1);
}

const prisma = new PrismaClient();

process.on("exit", async () => {
  await prisma.$disconnect();
});

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

// Initialize session
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({
    status: "error",
    message: err.message,
  });
});

const main = async () => {
  try {
    await prisma.$connect();
    console.log("Database connection established");

    // Initialize Passport configuration
    initialize(
      passport,
      async (email) =>
        (await prisma.user.findUnique({ where: { email } })) ?? undefined,
      async (id) =>
        (await prisma.user.findUnique({ where: { id } })) ?? undefined,
    );

    app.listen(port, () => {
      console.log(`App running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
};

main();
