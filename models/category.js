const mongoose = require('mongoose');
const categorySchemaDefinition = {
    // add each element and its properties
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String, 
        default:""
    }

};
 var categorySchema = new mongoose.Schema(categorySchemaDefinition);
 module.exports = mongoose.model('Category',categorySchema);