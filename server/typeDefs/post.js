const { gql } = require('apollo-server-express');

module.exports = gql`
    type Post {
        _id: ID!
        title: String
        content: String
        images: [Image]
        postedBy: User
        likedBy: [User]
    }
    type Image {
        url: String
        public_id: String
    }
    input ImageInput {
        url: String
        public_id: String
    }
    # input type
    input PostCreateInput {
        title: String!
        content: String!
        images: [ImageInput]
    }
    # input type
    input PostUpdateInput {
        _id: String!
        title: String!
        content: String!
        images: [ImageInput]
    }
    # queries
    type Query {
        posts: [Post]!
        totalPosts: Int!
        allPosts(page: Int): [Post!]!
        postsByUser: [Post!]!
        postsByUsername(username: String!): [Post!]!
        postsByLiked: [Post!]!
        singlePost(postId: String!): Post!
        search(query: String): [Post]
    }
    # mutations
    type Mutation {
        postCreate(input: PostCreateInput!): Post!
        postUpdate(input: PostUpdateInput!): Post!
        addLiked(postId: String!): Post!
        removeLiked(postId: String!): Post!
        postDelete(postId: String!): Post!
    }
    # subscriptions
    type Subscription {
        postAdded: Post
        postUpdated: Post
        postDeleted: Post
    }
`;
