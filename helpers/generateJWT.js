import jwt from 'jsonwebtoken';

const generateJWT = ( id, name, email ) => {

    return jwt.sign( { id, name, email }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    } );
}

export default generateJWT;
