const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// SSM
async function getMongoUri() {
  const client = new SSMClient({ region: 'ap-south-1' });
  const command = new GetParameterCommand({
    Name: '/myapp/MONGO_URI',
    WithDecryption: true
  });
  const response = await client.send(command);
  return response.Parameter.Value;
}

// Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});
const User = mongoose.model("User", UserSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email
  });

  await user.save();

  res.send("Data saved successfully in MongoDB");
});

// export
module.exports = app;

// start server
if (require.main === module) {
  (async () => {
    try {
      const mongoUri = await getMongoUri();
      await mongoose.connect(mongoUri);

      console.log("MongoDB Connected");

      app.listen(3000, () => {
        console.log("Server running on port 3000");
      });

    } catch (err) {
      console.error(err);
    }
  })();
}
