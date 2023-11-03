const express = require('express');
const router = express.Router();
const usersController = require('../controllers/api/usersController');
const queryController = require('../controllers/api/queryController');

const auth = require('../middleware/authMiddleware');
const multer  = require('multer')
const upload = multer()
const cpUpload = upload.fields([{ name: 'profile_picture', maxCount: 1 }, { name: 'card_photo', maxCount: 1 }])

router.post('/register',upload.none(), usersController.register);
router.post('/login', usersController.login);

router.get('/get-users', usersController.getAllUsers);
router.get('/get-users/:id', usersController.getUser);
router.put('/update-users/:id', usersController.updateUser);
router.delete('/delete-user/:id', usersController.deleteUser);
router.post('/user-photo/:id' ,usersController.addUserPhoto);
router.get('/mongo-queries' ,queryController.mongoQueries);
router.post('/user-address' ,usersController.userAddress);
router.get('/user-events' ,usersController.downloadAndDeleteCsv);
router.get('/download-pdf' ,usersController.downloadHtmlasPdf);
router.post('/update-address/:id' ,usersController.updateAddress);
router.get('/send-email' ,usersController.sendEmail);
router.get('/cookies' ,usersController.handleCookies);
router.get('/sessions' ,usersController.handleSession);
router.get('/pagination' ,usersController.pagination);










module.exports = router;               