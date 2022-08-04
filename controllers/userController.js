import User from '../models/User.js';
import { validationResult } from "express-validator";
import generateId from '../helpers/generateId.js';
import generateJWT from '../helpers/generateJWT.js';


const signup = async ( req, res ) => {

    // Errores express validator
    const errors = validationResult( req );
    if ( !errors.isEmpty() ) {
        return res.status( 400 ).json( { errors: errors.array() } );
    }
    
    // Evitar usuario duplicado
    const { email }     = req.body;
    const userExists    = await User.findOne( { email } );

    if ( userExists ) {
        const error = new Error('Usuario ya registrado');
        return res.status( 400 ).json( { message: error.message } );
    }

    try {

        const user      = new User( req.body );
        user.token      = generateId();
        await user.save();

        res.json( { message: '¡Usuario creado con éxito!' } );
        
    } catch ( error ) {
        console.log( error );
    }

};

const login = async ( req, res ) => {

    // Errores express validator
    const errors = validationResult( req );
    if ( !errors.isEmpty() ) {
        return res.status( 400 ).json( { errors: errors.array() } );
    }

    const { email, password } = req.body;

    // Comprueba si usuario existe
    const user = await User.findOne( { email } );

    if ( !user ) { // Si usuario no existe
        const error = new Error('El usuario no existe');
        return res.status( 401 ).json( { message: error.message } );
    }

    // Comprueba el password del usuario
    if ( await user.checkPassword( password ) ) {

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT( user._id, user.name, user.email )
        });


    } else {

        const error = new Error('Datos Incorrectos');
        return res.status( 401 ).json( { message: error.message } );
    }

};

const authenticatedUser = async ( req, res ) => {

    res.json({ user: req.user });
    
}

export {
    signup,
    login,
    authenticatedUser 
}
