const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        name: {
            type: String
        },
        email: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        image: {
            url: {
                type: String,
                default: 'https://yianmeanproject.s3.us-east-2.amazonaws.com/images/user_default.jpg'
            },
            public_id: {
                type: String,
                default: Date.now()
            }
        },
        about: {
            type: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
