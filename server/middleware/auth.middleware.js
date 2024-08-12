import jwt from 'jsonwebtoken';
import 'dotenv/config'
const jwtauthUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: 'Access denied. token expired.' });

    
    jwt.verify(token, process.env.SECRET_KEY,(err, decoded)=> {
        if(err) return res.status(403).json({message: err.message})
        req.user = decoded._id;
        next();
    })
    
  
};

const jwtauthAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' });
  jwt.verify(token, process.env.SECRET_KEY,(err, decoded)=> {
    if(err) return res.status(403).json({message: err.message});
    req.admin = decoded._id;
    next();
})
};


export {jwtauthUser, jwtauthAdmin}