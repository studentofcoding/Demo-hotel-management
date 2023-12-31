"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.cookies["auth_token"]; //here we are taking the token from the cookie
    if (!token) {
        return res.status(401).json({ message: "unauthorized" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY); //here we are verifying the token
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ message: "unauthorized" });
    }
};
exports.default = verifyToken;
