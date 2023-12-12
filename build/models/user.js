"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    empID: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
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
        type: String,
        default: ""
    },
    role: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });
const User = (0, mongoose_1.model)('user', userSchema);
exports.default = User;
