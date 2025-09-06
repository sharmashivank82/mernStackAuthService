const crypto = require("crypto");
const fs = require("fs");

// check the crypto document in nodejs website
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem", // public/private key file format is .pem
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
});

// console.log("public Key ", publicKey);
// console.log("private Key ", privateKey);

fs.writeFileSync("../certs/private.pem", privateKey);
fs.writeFileSync("../certs/public.pem", publicKey);
