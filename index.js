// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');

// Initialize Express app
const app = express();

// Set up middleware for parsing JSON requests
app.use(bodyParser.json());

// MongoDB connection
const MONGO_URL = 'mongodb+srv://amandeepmalik:amandeepmalik@expressjsauth.aaqse1v.mongodb.net/TasksApp?retryWrites=true&w=majority';
mongoose.connect(MONGO_URL);
const db = mongoose.connection;
db.on('connected', () => console.log('MongoDB connected'));
db.on('error', () => console.error(console, 'MongoDB connection error:'));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create a Mongoose schema for "Task" documents
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

// Retrieve task list by communicating to another microservice
const getTaskList = () => {
    axios.get('http://localhost:3001/tasks')
        .then(
            (response) => console.log(response.data),
            (error) => console.log(error)
        );
}

// Update a task by ID
app.put('/tasks/:taskId', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.taskId,
            req.body
        );
        if (updatedTask) {
            getTaskList();
        }
        return res.status(200).json(updatedTask).end();
    } catch (error) {
        console.log('task updation error', error);
        return res.sendStatus(400);
    }

});

// Delete a task by ID
app.delete('/tasks/:taskId', async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.taskId });
        if (deletedTask) {
            getTaskList();
        }
        return res.status(200).json(deletedTask).end();
    } catch (error) {
        console.log('task deletion error', error);
        return res.sendStatus(400);
    }
});

// Start the Express server
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Task Update/Delete Microservice is running on port ${port}`);
});
