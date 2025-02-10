const express = require("express");
const Dog = require("../models/dog.model");
const { getDogs, getDog, createDog, updateDog, deleteDog } = require("../controllers/dog.controller");

const router = express.Router();

router.get("/", getDogs);
router.get('/:id', getDog)
router.post('/',createDog)
router.put('/:id', updateDog)
router.delete('/:id', deleteDog)


module.exports = router