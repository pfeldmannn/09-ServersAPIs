import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

// DONE: Serve static files of entire client dist folder
app.use(express.static('../client/dist'));
// DONE: Implement middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// TODO: Implement middleware to connect the routes
app.use(routes);
app.get("*", (_req, res) => {
    res.sendFile('index.html', { root: '../client/dist' })
    });

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));

