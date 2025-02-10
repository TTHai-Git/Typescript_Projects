const express = require("express");
const { register, login, protectedRoute } = require('../controllers/auth.controller.js');
const authMiddleware = require('../middleware/authMiddleware.js')

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', authMiddleware, protectedRoute);

module.exports =  router;
