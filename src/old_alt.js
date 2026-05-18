if (condition) {
    
}
else if (req.method === 'POST' && url.pathname === '/todos') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on(async () => {
            try {
                //saves the recieved data
                const newTodo = JSON.parse(body);
                // fail if no title
                if (!newTodo.title) {
                    throw new Error ('Title is required');
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
                res.end(JSON.stringify({
                    message: 'Todo Created.',
                    data: newTodo
                }));
            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({
                    error:error.message
                }));
            }
            
        });
    }
