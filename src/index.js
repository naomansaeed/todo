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

    else if (req.method === 'POST' && url.pathname === '/todos') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
        try {

            //saves the recieved data
            const newTodo = JSON.parse(body);

            // fail if no title
                if (!newTodo.title){
                    throw new Error('Title is required');
                } 

            // read file contents asynchronously
            const todos = await getTodos();

            //generates id from date and saves as string value (adhoc way)
            newTodo.id = Date.now().toString();

            // appends to the in memory array
            todos.push(newTodo);

            // writes entire array to the file. null,2 are for indentation
            await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2));
            
            //sends status code on success
            res.statusCode = 201;
            
            // sends the newly created data.
            res.end(JSON.stringify({ message: 'Todo created', data: newTodo }));
            } catch (err) {
                //for handling error
               res.statusCode = 400;
               res.end(JSON.stringify({ error: err.message }));
    }
  });
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