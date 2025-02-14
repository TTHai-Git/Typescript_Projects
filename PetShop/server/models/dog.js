const mongoose = require('mongoose');

const DogSchema = new mongoose.Schema({
        name: {
            type: String,
            
        },
        breed: {
            type: String,
           
        },
        price: {
            type: Number,
            
        },
        description: {
            type: String,
            
        },
        imageUrl: {
            type: String,
        },

}, { 
    timestamps: true 
});

const Dog = mongoose.model('Dog', DogSchema);
module.exports = Dog;