const userController = require('../controller/userController');
const router = require('express').Router();


router.post('/register', userController.UserRegister);
router.post('/login', userController.UserLogin);


module.exports = router;

