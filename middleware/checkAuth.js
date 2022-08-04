import jwt from 'jsonwebtoken';


const checkAuth = async ( req, res, next ) => {
    
    const authHeader = req.get('Authorization');

    if ( authHeader ) {
        
        // Obtener el token
        const token = authHeader.split(' ')[1];

        // Comprueba JWT
        try {

            const user  = jwt.verify( token, process.env.JWT_SECRET );
            req.user    = user;
            
        } catch ( error ) {
            console.log( error );
            console.log('Token no valido');
        }

    } 

    return next();
}

export default checkAuth;