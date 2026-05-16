// 1. Loads the built-in HTTP module
const http = require('http');

// 2. Defines the port 
const PORT = 3000;

// 3. Creates the server with a basic request handler
const server = http.createServer((req,res) => {
    res.end('Hello from Node.js!');  // 4. Sends a simple response
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));