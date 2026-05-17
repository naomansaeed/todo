//  Loads the built-in HTTP module
const http = require('http');

//  Defines the port 
const PORT = 3000;

// Creates the server with a basic request handler
const server = http.createServer((req,res) => {
    //Set response header for JSON
    res.setHeader('Content-Type', 'application/json');

    //Parse the URL to access pathname & query params
    const url = new URL(req.url, `http://${req.headers.host}`);

    //Simple route: if GET request to /todos, send mock data
    if (req.method === 'GET' && url.pathname === '/todos') {
        res.statusCode = 200;
        res.end(JSON.stringify({
            message: 'GET /todos works!',
            data: []
        }));
    }
    else if (req.method === 'GET' && url.pathname === '/') {
        res.end(JSON.stringify({
            api: 'Todo api v1',
            endpoints: {'GET /todos': 'List all todos'}
        }));
    }
    else{
        res.statusCode = 404;
        res.end(JSON.stringify({
            error: 'Route not found'
        }));
    }
   // res.end('Hello from Node.js!');  //Sends a simple response
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));