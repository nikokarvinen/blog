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
exports.initialize = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_local_1 = require("passport-local");
// The initialize function sets up passport authentication strategy
function initialize(passport, getUserByEmail, getUserById) {
    // Function to authenticate a user
    const authenticateUser = (email, password, done) => __awaiter(this, void 0, void 0, function* () {
        // Retrieve user by email
        const user = yield getUserByEmail(email);
        // If user not found, return error
        if (user == null) {
            return done(new Error("No user with that email"));
        }
        try {
            // If user found, check if password matches
            if (yield bcrypt_1.default.compare(password, user.password)) {
                return done(null, user); // Correct password, return user
            }
            else {
                return done(new Error("Incorrect password"));
            }
        }
        catch (e) {
            return done(e);
        }
    });
    // Use LocalStrategy with custom function
    passport.use(new passport_local_1.Strategy({ usernameField: "email" }, authenticateUser));
    // Function to serialize user information (to be stored in session)
    passport.serializeUser((user, done) => {
        console.log("Serializing user with id:", user.id);
        done(null, user.id); // Store user id in session
    });
    // Function to deserialize user information (from session)
    passport.deserializeUser((id, done) => __awaiter(this, void 0, void 0, function* () {
        console.log("Deserializing user with id:", id);
        try {
            // Retrieve user by id
            const user = yield getUserById(id);
            console.log("Found user:", user);
            done(null, user); // Return user
        }
        catch (err) {
            console.error("Error fetching user:", err);
            done(err, null); // Error occurred, return error
        }
    }));
}
exports.initialize = initialize;
