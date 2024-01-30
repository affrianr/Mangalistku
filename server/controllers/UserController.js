const axios = require('axios');
const { comparePassword } = require('../helpers/bcrypt')
const { createToken } = require('../helpers/jwt')
const { User } = require('../models')
const {OAuth2Client} = require('google-auth-library');
const { param } = require('../routes');
const { subscribe } = require('../app');
const CLIENT_ID_GITHUB = process.env.CLIENT_ID_GITHUB
const CLIENT_SECRET_GITHUB = process.env.CLIENT_SECRET_GITHUB
/* global localStorage, */
const cloudinary = require('cloudinary').v2

cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret 
  });
class UserController {

    static async register(req, res, next) {
        try {
            const { fullName, email, password, role, phoneNumber } = req.body

            const user = await User.create({ fullName, email, password, role, phoneNumber })
            res
                .status(201)
                .json({
                    id: user.id,
                    email: user.email
                })
        } catch (error) {
            next(error)
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body

            if(!email || !password){
                throw { name : "login_error"}
            }
            const user = await User.findOne({
                where: {
                    email
                }
            })

            if(!user){
                throw { name : `login_error`}
            }

            
            const checkPassword = comparePassword(password, user.password)
            if(!checkPassword){
                throw { name : `Unauthorized`}
            }

            const access_token = createToken({
                id: user.id
            })

            res
                .status(200)
                .json({
                    id: user.id,
                    subscribe: user.subscribe,
                    access_token
                })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async userData(req, res, next){
        try {
            const findUser = await User.findByPk(req.user.id)
            if(!findUser){
                throw { name : "not_found"}
            }

            res 
                .status(200)
                .json(findUser)
        } catch (error) {
            next(error)
        }
    }

    static async googleLogin(req, res, next){
        const token = req.headers['google-token']
        const client = new OAuth2Client();
        console.log(process.env.CLIENT_ID_GOOGLE)
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.CLIENT_ID_GOOGLE,  // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            const payload = ticket.getPayload();
            const email = payload['email'];
            console.log(payload)

            let user = await User.findOne({
                where: {
                    email
                }
            })

            console.log(!!user,  "<<< user" )

            if(!user){
                user = await User.create({
                    fullName: payload.name,
                    email: payload.email,
                    password: 'password-boongan' + Date.now()
                }, {
                    hooks: false
                })
            }

            const access_token = createToken({
                id: user.id
            })
            // If request specified a G Suite domain:
            // const domain = payload['hd'];
            res
                .status(200)
                .json({
                    id: user.id,
                    access_token
                })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async githubLogin(req, res, next){
        try {
            console.log('masuk githublogin di server')
            const {code} = req.query
            console.log(code, '======== dari client')
            const params =  '?client_id=' + process.env.CLIENT_ID_GITHUB + '&client_secret='+ process.env.CLIENT_SECRET_GITHUB + '&code=' + code
            console.log(params, '==== params')
            const {data} = await axios({
                        url: 'https://github.com/login/oauth/access_token' + params,
                        method: 'POST',
                        headers: {
                            'accept': 'application/json'
                        }
                    })
            console.log(data)
            res
                .status(200)
                .json(data)
        } catch (error) {
            console.log(error, 'di github login')
            next(error)
        }
    }

    static async getGithubData(req, res, next){
        try {
            req.get('Authorization')
            const { data } = await axios('https://api.github.com/user', {
                method: 'GET',
                headers: {
                    'Authorization' : req.get('Authorization')
                }
            })
            console.log(data.id, data.login)
            let email
            if(!data.email){
                email = data.id + '@mangalistku.com'
            }
            const user = await User.findOne({
                where: {
                    email
                }
            })
            console.log(!!user,  "<<< user" )
            if(!user){
                user = await User.create({
                    fullName: data.login,
                    email: email,
                    password: 'password-boongan' + Date.now()
                }, {
                    hooks: false
                })  
            }
            const access_token = createToken({
                id: user.id
            })
            console.log(access_token)
            res
                .status(200)
                .json({
                    id: user.id,
                    access_token
                })
        } catch (error) {
            console.log(error, '===== di github data')
            next(error)
        }
    }

    static async updateProfile(req, res, next){
        try {
            const { fullName, email, password, phoneNumber } = req.body
            const user = await User.findByPk(req.user.id)

            const updated = await User.update({fullName, email, password, phoneNumber}, {
                where: {
                    id : req.user.id
                },
                returning: true
            })
            res.status(200).json({ message : `Successfully update the profile with ID ${user.id}`})
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async updateImage(req, res, next){
        try {
            console.log('masuk controller')
            const user = await User.findByPk(req.user.id)
            const base64 = Buffer.from(req.file.buffer).toString("base64")
            const dataURI = `data:${req.file.mimetype};base64,${base64}`
            const uploadedFile = await cloudinary.uploader.upload(dataURI, {
                folder: "users/img/",
                public_id: `${req.file.originalname}`
            })
            
            await User.update({ imgUrl : uploadedFile.secure_url }, {
                where: {
                    id : req.user.id
                },
                returning: true
            })
            
            res.status(200).json({
                message : `${user.fullName} profile picture has been updated`
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async subscription(req, res, next){
        try {
            await User.update({ subscribe: true}, {
                where: {
                    id: req.user.id
                }
            }) 
            res
                .status(200)
                .json({ message : `User with ID:${req.user.id} now is a subscriber!`})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController