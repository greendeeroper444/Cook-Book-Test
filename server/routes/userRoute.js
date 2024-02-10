const express = require('express')
const { signup, signin, getUser, signout } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', getUser);
router.post('/signout', signout);

module.exports = router;