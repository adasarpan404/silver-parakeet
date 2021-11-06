const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const sampleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us the name of sample'],
        unique: true,
    },
    scientificName: {
        type: String,
        required: [true, 'Please tell us the scientific name of sample' ],
    }, 
    species: {
        type: String,
        required: [true,'Please tell us the name of species' ]
    },
    genus: {
        type: String, 
        required: [true, 'Please tell us the name of genus']
    }, 
    family:{
        type: String, 
        required: [true, 'Please tell us the name of family']
    },
    image:{
        type: String, 
        required: [true, 'Please enter image']
    }

});
const Sample = mongoose.model('Sample', sampleSchema);
module.exports = Sample;