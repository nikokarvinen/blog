import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// The initialize function sets up passport authentication strategy
export function initialize(
  passport: PassportStatic,
  getUserByEmail: (email: string) => Promise<User | undefined>,
  getUserById: (id: number) => Promise<User | undefined>,
) {
  // Function to authenticate a user
  const authenticateUser = async (
    email: string,
    password: string,
    done: (error: any, user?: any) => void,
  ) => {
    // Retrieve user by email
    const user = await getUserByEmail(email);

    // If user not found, return error
    if (user == null) {
      return done(new Error("No user with that email"));
    }

    try {
      // If user found, check if password matches
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user); // Correct password, return user
      } else {
        return done(new Error("Incorrect password"));
      }
    } catch (e) {
      return done(e);
    }
  };

  // Use LocalStrategy with custom function
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

  // Function to serialize user information (to be stored in session)
  passport.serializeUser((user: any, done) => {
    console.log("Serializing user with id:", user.id);
    done(null, user.id); // Store user id in session
  });

  // Function to deserialize user information (from session)
  passport.deserializeUser(async (id: number, done) => {
    console.log("Deserializing user with id:", id);
    try {
      // Retrieve user by id
      const user = await getUserById(id);
      console.log("Found user:", user);
      done(null, user as any); // Return user
    } catch (err) {
      console.error("Error fetching user:", err);
      done(err, null); // Error occurred, return error
    }
  });
}
