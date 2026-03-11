require('dotenv').config();
const https = require('https');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

const server = https.createServer((req,res)=>{
res.writeHead(200,{'Content-Type':'text/plain'});
res.end("Hello from New AWS CI/CD Pipeline");
});

server.listen(3000,()=>{
console.log("Server running on port 3000");
});