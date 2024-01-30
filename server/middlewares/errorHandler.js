function errorHandlers(error, req, res, next){
    switch(error.name){
        case "Unauthorized":
            res.status(401).json({ message : "Error authentication"});
            break;
        case "login_error":
            res.status(401).json({ message : "Error invalid email/password"});
            break;
        case "NotAdmin":
            res.status(403).json({ message : "You are not authorized" });
            break;
        case "not_found":
            res.status(404).json({ message : "error not found" });
            break;
        case "owned":
            res.status(400).json({ message : "You are already own this manga"})
            break;
        case "not_subs":
            res.status(400).json({ message : "Please subscribe first to add the manga!"})
            break;
        case "SequelizeValidationError":
            const err = error.errors.map(el => el.message)
            res.status(400).json({message: err[0]})
            break;
        case "JsonWebTokenError":
            res.status(401).json({message : "Invalid Token"} )
            break;
        case "SequelizeUniqueConstraintError":
            const err1 = error.errors.map(el => el.message )
            res.status(400).json({message : err1[0]})
        default: 
            res.status(500).json({ message : "Internal Server Error"})
    }
}

module.exports = errorHandlers;