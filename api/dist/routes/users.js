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
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const express_validator_2 = require("express-validator");
const userRouter = express_1.default.Router();
// /api/users/register
userRouter.post("/register", [
    (0, express_validator_1.check)("email", "Email is required").isEmail(), //here we are using the express-validator to check if the email is valid or not
    (0, express_validator_1.check)("password", "Password is required atleast 6 characters").isLength({ min: 6 }),
    (0, express_validator_1.check)("firstName", "First Name is required").isString(),
    (0, express_validator_1.check)("lastName", "Last Name is required").isString(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_2.validationResult)(req); //here we are using the validationResult function to check if there is any error in the request
    if (!errors.isEmpty()) { //if errors is not empty then we are sending the errors in the form of array
        return res.status(400).json({ message: errors.array() }); //here we are sending the errors in the form of array
    }
    try {
        let user = yield user_1.default.findOne({
            email: req.body.email,
        });
        if (user) {
            return res.status(400).send({
                message: "Email already exists",
            });
        }
        user = new user_1.default(req.body);
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        });
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", //this is used to check if the environment is production or not 
            maxAge: 86400000, //expiresIn: "1d" in milliseconds
        });
        res.status(201).json({ message: "User registered successfully", token }); //todo: remove token from response by consideration
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error registering user" });
    }
}));
exports.default = userRouter;
