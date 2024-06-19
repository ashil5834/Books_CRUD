const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/books');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb+srv://ashilprakash369:5lOjBYYqp8mZL2IR@cluster0.kd5ilf2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Connection error:', error.message);
});

app.use(cors());
app.use(bodyParser.json());
app.use('/books', bookRoutes);

app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server is listening on port ${PORT}`);
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
