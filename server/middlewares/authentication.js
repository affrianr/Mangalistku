
const { verifyToken } = require("../helpers/jwt");
const { User } = require('../models')

const authentication = async (req, res, next) => {
    try {

        //cek apakah request membawa token
        const bearerToken = req.headers.authorization;
        if(!bearerToken){
            throw { name : "Unauthorized"}
        }

        //split bearer token dan mengambil token saja
        const token = bearerToken.split(' ')[1];

        // verify token menggunakan jwt verifier
        verified = await verifyToken(token)
        const userFound = await User.findByPk(verified.id)

        if(!userFound){
            throw { name : "Unauthorized"}
        }
        
        req.user = {
            id: userFound.id,
            email: userFound.email,
            subscribe : userFound.subscribe
        }
        next();
    } catch (error) {
        next(error)
    }
}

module.exports = authentication;