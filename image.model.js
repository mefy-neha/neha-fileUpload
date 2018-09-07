const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({

file:{
    type : Object
},
createdDate: {
    type: Date,
    default: Date.now
},
updatedDate: {
    type: Date,
    default: Date.now
},
enabled: {
    type: Number,
    default: 1
}

});

const image = module.exports = mongoose.model('image', imageSchema);