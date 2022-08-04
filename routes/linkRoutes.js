import express from 'express';
import { 
    create,
    getLink,
    getLinks,
    hasPassword,
    comparePassword
} from '../controllers/linkController.js';
import { check } from "express-validator";
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();


router.post('/create',
    [
        check('name', 'Añade un archivo').not().isEmpty(),
        check('original_name', 'Añade un archivo').not().isEmpty(),
    ],
    checkAuth,
    create 
);

router.get('/get-links', getLinks );

router.get('/get-link/:url', 
    hasPassword,
    getLink
);

router.post('/compare-password/:url',
    comparePassword,
    getLink
);

export default router;
