const { v4: uuidv4 } = require('uuid');
const fs = require("fs");

/**
 * POST /tasks
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next 
 * @returns 
 */
const createTask = (req, res, next) => {
    try {
        const { title, description } = req.body;
        // If required details not found then return with an error
        if(!title || !description){
            return res.status(400).json({
                "error": "Missing title or description"
            })
        }
        // Prepared task details object
        const taskDetails = {
            id: uuidv4(),
            title,
            description,
            status: "pending"
        }
        let tasks = fs.readFileSync("./data/tasks.json", { encoding: 'utf8', flag: 'r' });
        if(!tasks){
            tasks = [taskDetails];
        }
        else
        {
            tasks = JSON.parse(tasks);
            tasks.push(taskDetails);
        }
        fs.writeFileSync("./data/tasks.json", JSON.stringify(tasks));
        res.status(200).json({
            "message": "Task created successfully",
            "task": taskDetails
        })
    }
    catch(error){
        console.error('Error while creating task ', error);
        res.status(500).json({
            "error": "Internal server error"
        })
    }
}

/**
 * GET /tasks
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 */
const getTasks = (req, res, next) => {
    try {
        // Find tasks
        let tasks = fs.readFileSync("./data/tasks.json", { encoding: 'utf8', flag: 'r' });
        tasks = (!tasks)? []: JSON.parse(tasks);
        res.status(200).json(tasks);
    }
    catch(error){
        console.error('Error while getting tasks ', error);
        res.status(500).json({
            "error": "Internal server error"
        })
    }
}

/**
 * PUT /tasks/:id
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 * @returns 
 */
const updateTask = (req, res, next) => {
    try {
        const { status } = req.body;
        // If status not found then return with an error message
        if(!status){
            return res.status(400).json({
                "error": "Missing status"
            })
        }
        // Find tasks
        let tasks = fs.readFileSync("./data/tasks.json", { encoding: 'utf8', flag: 'r' });
        tasks = (!tasks)? []: JSON.parse(tasks);
        // Find the index of task need to update
        const taskIndex = tasks.findIndex((task) => task.id === req.params.id);
        if(taskIndex < 0){
            return res.status(400).json({
                "error": "Task not found"
            })
        }
        tasks[taskIndex]["status"] = status;
        fs.writeFileSync("./data/tasks.json", JSON.stringify(tasks));
        res.status(200).json({
            "message": "Task updated successfully",
            "task": tasks[taskIndex]
        })
    }
    catch(error){
        console.error(`Error while updating task ${req.params.id} `, error);
        res.status(500).json({
            "error": "Internal server error"
        })
    }
}

/**
 * DELETE /tasks/:id
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 * @returns 
 */
const deleteTask = (req, res, next) => {
    try {
        // Find tasks
        let tasks = fs.readFileSync("./data/tasks.json", { encoding: 'utf8', flag: 'r' });
        tasks = (!tasks)? []: JSON.parse(tasks);
        // Find index of task to remove
        const taskIndex = tasks.findIndex((task) => task.id = req.params.id);
        if(taskIndex < 0){
            return res.status(400).json({
                "error": "Task not found"
            })
        }
        tasks.splice(taskIndex, 1);
        fs.writeFileSync("./data/tasks.json", JSON.stringify(tasks));
        res.status(200).json({
            "message": "Task deleted successfully"
        })
    }
    catch(error){
        console.error(`Error while deleting task ${req.params.id} `, error);
        res.status(500).json({
            "error": "Internal server error"
        })
    }
}

/**
 * GET /tasks/status/:status
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 */
const getTasksByFilter = (req, res, next) => {
    try {
        const status = req.params.status;
        // Find tasks and filter by status
        let tasks = fs.readFileSync("./data/tasks.json", { encoding: 'utf8', flag: 'r' });
        tasks = (!tasks)? []: JSON.parse(tasks);
        tasks = tasks.filter((task) => task.status == status);
        res.status(200).json(tasks);
    }
    catch(error){
        console.error('Error while getting filtered tasks ', error);
        res.status(500).json({
            "error": "Internal server error"
        })
    }
}

module.exports = {
    createTask: createTask,
    getTasks: getTasks,
    updateTask: updateTask,
    deleteTask: deleteTask,
    getTasksByFilter: getTasksByFilter
}