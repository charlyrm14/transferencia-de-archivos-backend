import Link from "../models/Link.js";
import { validationResult } from "express-validator";
import shortid from "shortid";
import bcrypt from 'bcrypt';


const create = async ( req, res ) => {


    // Errores express validator
    const errors = validationResult( req );
    if ( !errors.isEmpty() ) {
        return res.status( 400 ).json( { errors: errors.array() } );
    }
    
    const { original_name, name } = req.body;

    const link          = new Link();
    link.url            = shortid.generate();
    link.name           = name;
    link.original_name  = original_name;
    

    // Si el usuario esta autenticado
    if ( req.user ) {
        const { password, downloads } = req.body;

        // Asignar a enlace el número de descargas
        if ( downloads ) {
            link.downloads  = downloads;
        }

        // Asignar contraseña
        if ( password ) {
            const salt      = await bcrypt.genSalt(10);
            link.password   = await bcrypt.hash( password, salt );
        }

        // Asignar el autor
        link.author = req.user.id;
    }

    try {
        await link.save();
        res.json( { message: `${ link.url }`} );

    } catch (error) {
        console.log( error );
    }

};


// Evalua si el enlace tiene password o no 
const hasPassword = async ( req, res, next ) => {

    const { url } = req.params;

    // Verificar si existe enlace
    const link = await Link.findOne( { url } );

    if (!link) {
        const error = new Error('El enlace no existe');
        return res.status( 404 ).json( { message: error.message } );
    }

    if ( link.password ) {
        return res.json({ password: true, link: link.url });
    }

    next();

};

// Comparar contraseña de form con el de BD
const comparePassword = async ( req, res, next ) => {
    
    const { url }       = req.params;
    const { password }  = req.body;

    // Verificar si existe enlace
    const link = await Link.findOne( { url } );

    if ( bcrypt.compareSync( password, link.password ) ) {
        // Permitir descargar archivo si las contraseñas coinciden
        next();

    } else {
        const error = new Error('Contraseña incorecta');
        return res.status( 401 ).json( { message: error.message } );
    }

};

const getLink = async ( req, res, next ) => {

    const { url } = req.params;

    // Verificar si existe enlace
    const link = await Link.findOne( { url } );


    if (!link) {
        const error = new Error('El enlace no existe');
        return res.status( 404 ).json( { message: error.message } );
    }

    res.json( { file: link.name, password: false } );
    
    next();

};



const getLinks = async ( req, res ) => {

    try {

        const links = await Link.find({}).select('url -_id');

        res.json({ links });
        
    } catch ( error ) {
        console.log( error );
    }

};



export {
    create,
    getLink,
    getLinks,
    hasPassword,
    comparePassword
}