const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({

    speciality: {
        type: String,
        unique: true,
    },
    description: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: Date.now
    },

});

const doctor = module.exports = mongoose.model('doctor', doctorSchema);