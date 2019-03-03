const AWS = require('aws-sdk')
const CryptoJS = require("crypto-js")
const isUrl = require('is-url')

const dynamodb = new AWS.DynamoDB({
    region: 'us-west-2'
})

const URLMessage = process.argv[2]

if(!isUrl(URLMessage)){
    throw new Error("Not a valid url")
}

const encryptionKey = process.env.encryption_key
const ciphertext = CryptoJS.AES.encrypt(URLMessage, encryptionKey).toString()

const params = {
    Item: {
     "requestId": {
       S: ciphertext
      },
      "time": {
          N: `${Date.now()}`
      }
    },
    TableName: "asset-request-history"
   };
   dynamodb.putItem(params, function(err, data) {
     if (err) throw new Error(err)
     else     console.log(data)
   });