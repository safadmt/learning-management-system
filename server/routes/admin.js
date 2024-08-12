import express from 'express';
const router = express.Router();
import { getAllCategories , getCategorybyId} from '../controllers/admin.js';

router.get('/categories', getAllCategories);
router.get('/categories/:id', getCategorybyId);
router.get('*', (req,res)=> {
    res.send("Wrong routing")
})
export default router;