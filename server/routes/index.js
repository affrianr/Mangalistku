const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const MangaController = require('../controllers/MangaController')
const { route } = require('../app')
const authentication = require('../middlewares/authentication')
// ========== MULTER =========
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage : storage})

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/auth/google', UserController.googleLogin)

router.get('/auth/github', UserController.githubLogin)
router.get('/auth/github/token', UserController.getGithubData)


// passport.use(twitterStrategy)

router.get('/details/:mangaId', MangaController.details)
router.get('/', MangaController.manga)
router.use(authentication)
router.get('/profile', UserController.userData)
router.put('/update-profile', UserController.updateProfile)
router.patch('/update-profile', upload.single('image'), UserController.updateImage)
router.post('/generate-midtrans-token', MangaController.getMidtransToken)
router.patch('/subscription', UserController.subscription)
router.get('/list', MangaController.list)
router.post('/list/add/:mangaId', MangaController.addToList)
router.delete('/list/:id', MangaController.removeFromList)



module.exports = router