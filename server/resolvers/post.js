const { gql } = require('apollo-server-express');
//const { posts } = require('../temp');
const { authCheck } = require('../helpers/auth');
const { DateTimeResolver } = require('graphql-scalars');
const Post = require('../models/post');
const User = require('../models/user');

// subscriptions
const POST_ADDED = 'POST_ADDED';
const POST_UPDATED = 'POST_UPDATED';
const POST_DELETED = 'POST_DELETED';

// mutation
const postCreate = async (parent, args, { req, pubsub }) => {
    const currentUser = await authCheck(req);
    // validation
    if (args.input.content.trim() === '') throw new Error('Content is required');

    const currentUserFromDb = await User.findOne({
        email: currentUser.email
    });
    let newPost = await new Post({
        ...args.input,
        postedBy: currentUserFromDb._id
    })
        .save()
        .then((post) => {
            console.log("post from server : ", post)
            return post.populate('postedBy', '_id username').execPopulate()
        });

    pubsub.publish(POST_ADDED, { postAdded: newPost });

    return newPost;
};

const allPosts = async (parent, args) => {
    const currentPage = args.page || 1;
    const perPage = 3;

    return await Post.find({})
        .skip((currentPage - 1) * perPage)
        .populate('postedBy', 'username _id')
        .limit(perPage)
        .sort({ createdAt: -1 })
        .exec();
};

const posts = async (parent, args) => await Post.find({}).populate('postedBy', '_id username').exec();

const postsByUser = async (parent, args, { req }) => {
    const currentUser = await authCheck(req);
    const currentUserFromDb = await User.findOne({
        email: currentUser.email
    }).exec();

    return await Post.find({ postedBy: currentUserFromDb })
        .populate('postedBy', '_id username')
        .sort({ createdAt: -1 });
};

const postsByUsername = async (parent, args, { req }) => {

    const currentUserFromDb = await User.findOne({
        username: args.username
    }).exec();

    return await Post.find({ postedBy: currentUserFromDb })
        .populate('postedBy', '_id username')
        .sort({ createdAt: -1 });
};

const postsByLiked = async (parent, args, { req }) => {
    const currentUser = await authCheck(req);
    const currentUserFromDb = await User.findOne({
        email: currentUser.email
    }).exec();

    return await Post.find({ likedBy: currentUserFromDb._id })
        .populate('postedBy', '_id username')
        .sort({ createdAt: -1 });
};

const singlePost = async (parent, args) => {
    return await Post.findById({ _id: args.postId })
        .populate('postedBy', '_id username')
        .exec();
};

const postUpdate = async (parent, args, { req, pubsub }) => {
    const currentUser = await authCheck(req);
    // validation
    if (args.input.content.trim() === '') throw new Error('Content is requried');
    //  get current user mongodb _id based in email
    const currentUserFromDb = await User.findOne({ email: currentUser.email }).exec();
    // _id of post to update
    const postToUpdate = await Post.findById({ _id: args.input._id }).exec();
    // if currentuser id and id of the post's postedBy user id is same, allow update
    if (currentUserFromDb._id.toString() !== postToUpdate.postedBy._id.toString())
        throw new Error('Unauthorized action');
    let updatedPost = await Post.findByIdAndUpdate(args.input._id, { ...args.input }, { new: true })
        .exec()
        .then((post) => post.populate('postedBy', '_id username').execPopulate());

    pubsub.publish(POST_UPDATED, {
        postUpdated: updatedPost
    });

    return updatedPost;
};

const addLiked = async (parent, args, { req }) => {
    const currentUser = await authCheck(req);

    //  get current user mongodb _id based in email
    const currentUserFromDb = await User.findOne({ email: currentUser.email }).exec();

    // _id of post to update
    const postToUpdate = await Post.findById({ _id: args.postId }).exec();
    const isLiked = postToUpdate.likedBy.some(u => u._id === currentUserFromDb._id)

    if (isLiked) return

    let updatedPost = await Post.findByIdAndUpdate(args.postId, { likedBy: [...postToUpdate.likedBy, currentUserFromDb._id] }, { new: true })
        .exec()
        .then((post) => post.populate('postedBy', '_id username').execPopulate());

    return updatedPost;
};

const removeLiked = async (parent, args, { req }) => {
    const currentUser = await authCheck(req);

    //  get current user mongodb _id based in email
    const currentUserFromDb = await User.findOne({ email: currentUser.email }).exec();

    // _id of post to update
    const postToUpdate = await Post.findById({ _id: args.postId }).exec();
    const newLikedList = postToUpdate.likedBy.filter(user => user._id.toString() !== currentUserFromDb._id.toString())
    let updatedPost = await Post.findByIdAndUpdate(args.postId, { likedBy: newLikedList }, { new: true })
        .exec()
        .then((post) => post.populate('postedBy', '_id username').execPopulate());

    return updatedPost;
};

const postDelete = async (parent, args, { req, pubsub }) => {
    const currentUser = await authCheck(req);
    const currentUserFromDb = await User.findOne({ email: currentUser.email }).exec();
    const postToDelete = await Post.findById({ _id: args.postId }).exec();
    if (currentUserFromDb._id.toString() !== postToDelete.postedBy._id.toString())
        throw new Error('Unauthorized action');
    let deletedPost = await Post.findByIdAndDelete({ _id: args.postId })
        .exec()
        .then((post) => post.populate('postedBy', '_id username').execPopulate());

    pubsub.publish(POST_DELETED, {
        postDeleted: deletedPost
    });

    return deletedPost;
};

const totalPosts = async (parent, args) =>
    await Post.find({})
        .estimatedDocumentCount()
        .exec();

const search = async (parent, { query }) => {
    return await Post.find({ $text: { $search: query } })
        .populate('postedBy', 'username')
        .exec();
};


module.exports = {
    Query: {
        allPosts,
        postsByUser,
        postsByUsername,
        postsByLiked,
        singlePost,
        totalPosts,
        search,
        posts
    },
    Mutation: {
        postCreate,
        postUpdate,
        postDelete,
        addLiked,
        removeLiked,
    },
    Subscription: {
        postAdded: {
            subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator([POST_ADDED])
        },
        postUpdated: {
            subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator([POST_UPDATED])
        },
        postDeleted: {
            subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator([POST_DELETED])
        }
    }
};
