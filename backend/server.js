// 1. Import the express library we just installed
const express = require('express');

// 2. Create an "app" - this represents our whole server
const app = express();

// 3. Define a port number - the "address" our server listens on
const PORT = 5000;

// 4. Define a route: when someone visits the homepage ("/"), send back a message
app.get('/', (req, res) => {
  res.send('Hello from the Notes App backend!');
});

// 5. Start the server - make it actually listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});