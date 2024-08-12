import 'dotenv/config'
import jwt from 'jsonwebtoken'
const jwtToken = (res,user) => {
   
    jwt.sign({_id: user.insertedId},process.env.SECRET_KEY, {expiresIn: '5h'}, (err, decoded)=> {
        
        if(err) throw err
        res.cookie('token',decoded,
                {
                    maxAge: 5 * 60 * 60 * 60 * 1000,
                    httpOnly : true,
                    secure : process.env.NODE_ENV !== 'development',
                   
                })
        
    } )
}

export default jwtToken 