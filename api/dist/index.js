"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
mongoose_1.default.connect(process.env.MONGO)
    .then(() => console.log('Connected to Database successfully'))
    .catch((err) => console.log(err));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL, //the server will only accept the request from this particular url
    credentials: true, //this is used to send the cookie to the server so that the server can identify the user where the security is increased
}));
app.use(express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
app.use("/api/users", users_1.default); //this route is used to register the user
app.use("/api/auth", auth_1.default); //this route is used to login the user
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
