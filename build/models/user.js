"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: (props) => `${props.value} is not a valid email address`,
        },
    },
    about: {
        type: String
    },
    role: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
const User = (0, mongoose_1.model)('user', userSchema);
exports.default = User;
