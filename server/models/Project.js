const mongoose = require('mongoose')


const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    team_members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    task_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }],
    deadline: {
        type: Date
    }
})

module.exports = mongoose.model('Project', ProjectSchema)