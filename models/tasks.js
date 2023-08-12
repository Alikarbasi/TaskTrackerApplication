const mongoose = require('mongoose');
const taskSchemaDefinition = {
    // add each element and its properties
    date:{
        type : Date,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    duration: {
        hours: {
            type: Number,
            required: true
        },
        minutes: {
            type: Number,
            required: true
        }
    },
    comment: {
        type : String
    }
};
 var taskSchema = new mongoose.Schema(taskSchemaDefinition);
 module.exports = mongoose.model('Task',taskSchema);