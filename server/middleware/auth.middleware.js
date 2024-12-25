import jwt from 'jsonwebtoken';
import  User  from '../models/User';
import createError from '../utils/createError';

export const authenticateUser = async (req, res, next) => {
    try{
        const accessToken = req.cookies.accessToken;

        if(!accessToken){
            return next(createError(401, 'Unauthorized'));
        }

        try{const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if(!user){
            return next(createError(401, 'User not found'));
        }
        req.user = user;
        next();}
        catch(err){
            if(err.name === 'TokenExpiredError'){
                return res.status(401).json({message: 'Token expired - Unauthorized'});
            }
            throw err;
            
        }
        } catch (err) {
            console.error("Error Authenticating User", err.message);
            return next(createError(500, 'Internal Server Error'));
       
    }
}

export const authenticateAdmin  =(req, res, next) =>{
    if(req.user && req.user.role === 'admin'){
        next();
    }
    return createError(403, 'Access Denied - Admin Only')
} 