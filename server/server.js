const express = require('express');
const { ApolloServer, PubSub } = require('apollo-server-express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
require('dotenv').config();
const { authCheckMiddleware } = require('./helpers/auth');
const cors = require('cors');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary');
const AWS = require('aws-sdk');

const pubsub = new PubSub();

// express server
const app = express();

// db
const db = async () => {
    try {
        const success = await mongoose.connect(process.env.DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('DB Connected');
    } catch (error) {
        console.log('DB Connection Error', error);
    }
};
// execute database connection
db();

// middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

// typeDefs
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './typeDefs')));
// resolvers
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

// graphql server
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub })
});

// applyMiddleware method connects ApolloServer to a specific HTTP framework ie: express
apolloServer.applyMiddleware({ app });

// server
const httpserver = http.createServer(app);
apolloServer.installSubscriptionHandlers(httpserver);

// rest endpoint
app.get('/rest', authCheckMiddleware, function (req, res) {
    res.json({
        data: 'you hit rest endpoint great!'
    });
});

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID
});

app.post('/awsuploadimages', authCheckMiddleware, (req, res) => {
    const public_id = `${Date.now()}`
    //console.log("req.body.image : ",req.body.image)
    //req.body.image
    buff = Buffer.from(req.body.image.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    const params = {
        ACL: "public-read",
        Bucket: process.env.AWS_FILE_PATH,
        Key: public_id, // File name you want to save as in S3
        Body: buff,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    };
    console.log("Uploading ...")
    s3.upload(params, (error, data) => {
        if (error) {
            throw error;
        }
        res.send({
            url: data.Location,
            public_id: public_id
        })
        console.log(`File uploaded successfully. ${data.Location}`);
    });
});

app.post('/awsremoveimage', authCheckMiddleware, (req, res) => {
    let image_id = req.body.public_id;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: { // required
            Objects: [ // required
                {
                    Key: `images/${image_id}` // required
                }
            ],
        },
    };

    s3.deleteObjects(params, (error, data) => {
        if (error) console.log(error, error.stack); // an error occurred
        else {
            res.send({
                deleted: 'OK',
            })
            console.log(data); // successful response
        }
    });

    // cloudinary.uploader.destroy(image_id, (error, result) => {
    //     if (error) return res.json({ success: false, error });
    //     res.send('ok');
    // });
});

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// upload
app.post('/uploadimages', authCheckMiddleware, (req, res) => {
    cloudinary.uploader.upload(
        req.body.image,
        (result) => {
            console.log(result);
            res.send({
                // url: result.url,
                url: result.secure_url,
                public_id: result.public_id
            });
        },
        {
            public_id: `${Date.now()}`, // public name
            resource_type: 'auto' // JPEG, PNG
        }
    );
});

// remove image
app.post('/removeimage', authCheckMiddleware, (req, res) => {
    let image_id = req.body.public_id;

    cloudinary.uploader.destroy(image_id, (error, result) => {
        if (error) return res.json({ success: false, error });
        res.send('ok');
    });
});

// port
httpserver.listen(process.env.PORT, function () {
    console.log(`server is ready at http://localhost:${process.env.PORT}`);
    console.log(`graphql server is ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
    console.log(`subscription is ready at http://localhost:${process.env.PORT}${apolloServer.subscriptionsPath}`);
});
