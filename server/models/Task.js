const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    dependencies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }],
    skills: [{
        type: String,
    }],
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed']
    }
})

module.exports = mongoose.model('Task', TaskSchema)