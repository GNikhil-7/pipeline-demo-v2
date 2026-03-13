const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Get MongoDB URI from SSM
async function getMongoUri() {
  const client = new SSMClient({ region: 'ap-south-1' });

  const command = new GetParameterCommand({
    Name: '/myapp/MONGO_URI',
    WithDecryption: true
  });

  const response = await client.send(command);
  return response.Parameter.Value;
}

// MongoDB Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});

const User = mongoose.model("User", UserSchema);

// Start server after DB connection
async function startServer() {

  const mongoUri = await getMongoUri();

  await mongoose.connect(mongoUri);

  console.log("MongoDB Connected");

// Landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Form submit
app.post('/submit', async (req, res) => {

  const user = new User({
    name: req.body.name,
    email: req.body.email
  });

  await user.save();

  res.send("Data saved successfully in MongoDB");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

}

startServer();
