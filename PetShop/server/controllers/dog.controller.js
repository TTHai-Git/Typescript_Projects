const Dog = require("../models/dog.model");

const getDogs = async (req, res) => {
    try {
        const dogs = await Dog.find();
        res.status(200).json(dogs);
    } catch {
        res.status(500).json({ message: "Error" });
    }
};

const getDog = async (req, res) => {
    try {
        const dog = await Dog.findById(req.params.id)
        if (!dog) res.status(404).send('No Dog Found')
        res.status(200).json(dog)
    } catch {
        res.status(500).json({ message: 'Error' })
    }
}

const createDog = async (req, res) => {
    try{
        const dog = await Dog.create(req.body)
        res.status(201).json(dog)
    } catch {
        res.status(500).send('Error')
    } 
}

const updateDog = async (req, res) => {
    try {
        const id = req.params.id
        const dog = await Dog.findByIdAndUpdate(id, req.body)
        if (!dog) res.status(404).send('No Dog Found')
        res.status(200).json(dog)
    } catch {
        res.status(500).send('No Dog Found')
    }
}

const deleteDog = async (req, res) => {
    try {
        const dog = await Dog.findByIdAndDelete(req.params.id)
        if (!dog) res.status(404).send('No Dog Found')
        res.status(200).send("Dog Deleted")
    } catch {
        res.status(500).send('Error')
    }
}

module.exports = {
    getDogs,
    getDog,
    createDog,
    updateDog,
    deleteDog,
}