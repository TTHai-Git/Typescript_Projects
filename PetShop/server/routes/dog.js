const express = require("express");
const {
  getDogs,
  getDog,
  createDog,
  updateDog,
  deleteDog,
} = require("../controllers/dog");

const router = express.Router();

router.get("/:page", getDogs);
router.get("/:page/dog/:id/info", getDog);
router.post("/", createDog);
router.put("/:id", updateDog);
router.delete("/:id", deleteDog);

module.exports = router;
