import express from 'express';
import { 
    signup,
    login,
    authenticatedUser 
} from '../controllers/userController.js';
import { check } from "express-validator";
import checkAuth from '../middleware/checkAuth.js';


const router = express.Router();

router.post('/signup',
    
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un correo electrónico valido').isEmail(),
        check('password', 'La contraseña debe contener al menos 6 caracteres').isLength( { min: 6 } )
    ],
    signup

);


router.post('/login',
    [
        check('email', 'Agrega un correo electrónico valido').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty()
    ],
    login
);

router.get('/login', 
    checkAuth,
    authenticatedUser
);



export default router;
