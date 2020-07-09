const fs = require('fs');
const AWS = require('aws-sdk');

//const ID = process.env.REACT_APP_AWS_KEY_ID;
//const SECRET = process.env.REACT_APP_AWS_SECRET_KEY_ID;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    //console.log("Test",process.env.REACT_APP_PASSWORD_FORGOT_REDIRECT)
    //console.log(ID,"=====",SECRET)
    // Setting up S3 upload parameters
    const params = {
        ACL: "public-read",
        Bucket: "yianmeanproject/images",
        Key: 'cat.jpg', // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    //console.log('Start uploading')
    s3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

uploadFile('cat.jpg');