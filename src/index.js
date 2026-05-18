//  Loads the built-in HTTP module
const http = require('http');
// Loads the promises-based File System API
const fs = require('fs').promises;
//Loads path utility for safe cross-platform file paths
const path = require('path');

//  Defines the port 
const PORT = 3000;

//Absolute path to our JSON "database"
const DATA_FILE = path.join(__dirname,'..','data','todos.json');
//Async function to read todos from disk
async function getTodos() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file missing/corrupted, return empty array
        console.error('Error reading todos',error.message);
        return [];
    }
}

// Creates the server with a basic request handler
const server = http.createServer( async(req,res) => {
    //Set response header for JSON
    res.setHeader('Content-Type', 'application/json');

    //Parse the URL to access pathname & query params
    const url = new URL(req.url, `http://${req.headers.host}`);

    //Simple route: if GET request to /todos, send mock data
    if (req.method === 'GET' && url.pathname === '/todos') {
        const todos = await getTodos();
        res.statusCode = 200;
        res.end(JSON.stringify({
            message: 'GET /todos works!',
            data: todos
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