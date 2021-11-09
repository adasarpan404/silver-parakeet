const mongoose = require('mongoose')

const sampleSchema = new mongoose.Schema({
    species: {
        type: String,
        required: [true, 'Please tell us the name of species'],
        unique: true
    },
    genus: {
        type: String,
        required: [true, 'Please tell us the name of genus']
    },
    family: {
        type: String,
        required: [true, 'Please tell us the name of family']
    },
    image: {
        type: String,
    },
    siteofcollection: {
        type: String,
        required: [true, 'Please tell us the site of collection']
    },
    timeofcollection: {
        type: String,
        required: [true, 'Please tell us time of collection']
    },
    nameofcollector: {
        type: String,
        required: [true, 'Please tell us the name of sample collector']
    }
});
const Sample = mongoose.model('Sample', sampleSchema);
module.exports = Sample;