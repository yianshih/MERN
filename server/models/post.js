const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: 'Title is required',
            text: true
        },
        content: {
            type: String,
            required: 'Content is required',
            text: true
        },
        images: {
            type: Array,
            default: [
                {
                    url: 'https://via.placeholder.com/200x200.png?text=Profile',
                    public_id: '123'
                }
            ]
        },
        postedBy: {
            type: ObjectId,
            ref: 'User'
        },
        likedBy: [
            {
                type: ObjectId,
                ref: 'User',
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
