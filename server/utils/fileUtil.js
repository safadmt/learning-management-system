import multer from 'multer';
import path from 'path';
const storage = multer.diskStorage({
    destination: (req, file, callabck)=> {
        callabck(null, './public/user/');
    },
    filename: (req,file, callabck)=> {
        const uniqueFileName = Date.now() + Math.round(Math.random() * 100 * 184) * path.extname(file.originalname);
        callabck(null, uniqueFileName)
    }
})

export const uploadProfilePic = multer({storage: storage});