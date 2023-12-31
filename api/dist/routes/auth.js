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
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../middleware/auth"));
const authRouter = express_1.default.Router();
authRouter.post("/login", [
    (0, express_validator_1.check)("email", "Email is required").isEmail(),
    (0, express_validator_1.check)("password", "Password is required atleast 6 characters").isLength({
        min: 6,
    }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "Invalid Credentials" });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid Credentials" });
        }
        const token = jsonwebtoken_1.default.sign(//creating an access token  If the passwords match, it generates a JSON Web Token (JWT) using jwt.sign containing the userId from the found user. This token is signed with a secret key 
        {
            userId: user.id,
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        });
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });
        res.status(200).json({ message: "Logged in successfully", userId: user.id });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error logging in" });
    }
}));
authRouter.get("/validate-token", auth_1.default, (req, res) => {
    res.status(200).json({ message: "Token is valid", userId: req.userId }); //here we are sending the userId to the client
});
authRouter.post("/logout", (req, res) => {
    res.cookie("auth_token", "", {
        expires: new Date(0),
    });
    res.send(); //this is used to send the response without been hanging in the browser
});
exports.default = authRouter;
//authRouter=> middleware(verifyToken)
