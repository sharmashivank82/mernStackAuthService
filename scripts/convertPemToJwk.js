// convert public key to jwks token
const fs = require("fs");
const rsaPemToJwk = require("rsa-pem-to-jwk");

const privateKey = fs.readFileSync("../certs/private.pem");
console.log({ privateKey });

// this is a type of a public key of this private key we need to host this key
const jwk = rsaPemToJwk(privateKey, { user: "sig" }, "public"); // <-- yhe ek key return karti hai
console.log({ jwk });
