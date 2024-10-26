const http = require("http");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const querystring = require("querystring");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/details", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// Define the todo schema
const todoschema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean
});

// Create the model
const Todo = mongoose.model("todos", todoschema);

// Create the HTTP server
const server = http.createServer((req, res) => {
    // Serve index.html for the root URL
    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" });
        fs.createReadStream("index.html").pipe(res);
    }
    // Handle POST request to add a new todo item
    else if (req.url === "/addtodo" && req.method === "POST") {
        let rawData = "";

        req.on("data", chunk => {
            rawData += chunk;
        });

        req.on("end", () => {
            // Parse the form data from rawData
            const formData = querystring.parse(rawData);

            // Log the form data to ensure it's received properly
            console.log("Todo Data received:", formData);

            // Store the form data as a new todo item in MongoDB
            Todo.create({
                title: formData.title,
                description: formData.description,
                completed: false
            })
            .then(() => {
                // After successful addition, redirect to viewtodos
                res.writeHead(302, { "Location": "/viewtodos" });
                res.end();
            })
            .catch(err => {
                console.error("Database error:", err);
                res.writeHead(500, { "Content-Type": "text/html" });
                res.end("<h1>Internal Server Error</h1><p>Could not add todo.</p>");
            });
        });
    }
    // Handle GET request to view all todo items
    else if (req.url === "/viewtodos" && req.method === "GET") {
        Todo.find()
        .then((todos) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write("<h1>Todo List</h1>");
            res.write("<table border=1 cellspacing=0 width=500>");
            res.write("<tr><th>Title</th><th>Description</th><th>Completed</th></tr>");
            todos.forEach(todo => {
                res.write("<tr>");
                res.write(`<td>${todo.title}</td>`);
                res.write(`<td>${todo.description}</td>`);
                res.write(`<td>${todo.completed ? "Yes" : "No"}</td>`);
                res.write("</tr>");
            });
            res.write("</table>");
            res.end();
        })
        .catch(err => {
            console.error("Error fetching todos:", err);
            res.writeHead(500, { "Content-Type": "text/html" });
            res.end("<h1>Internal Server Error</h1><p>Could not retrieve todos.</p>");
        });
    }
    // Serve static files (CSS and JS)
    else if (req.url.endsWith(".css") && req.method === "GET") {
        const filePath = path.join(__dirname, req.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("404 Not Found");
            } else {
                res.writeHead(200, { "Content-Type": "text/css" });
                res.end(data);
            }
        });
    } else if (req.url.endsWith(".js") && req.method === "GET") {
        const filePath = path.join(__dirname, req.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("404 Not Found");
            } else {
                res.writeHead(200, { "Content-Type": "application/javascript" });
                res.end(data);
            }
        });
    }
    // Handle 404 errors for unknown routes
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
});

// Start the server
server.listen(27014, () => {
    console.log("Server running at http://localhost:27014/");
});
