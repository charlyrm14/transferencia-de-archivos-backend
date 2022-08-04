import multer from "multer";
import shortid from "shortid";
import fs from "fs";
import Link from "../models/Link.js";


const uploadFile = async ( req, res, next ) => {

    const configMulter = {
        limits : { fileSize: req.user ? 1024 * 1024 * 10 : 1024 * 1024 }, 
            // si usuario esta autenticado permite subir archivos mas grandes
            storage : multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './uploads')
            },
            filename: function (req, file, cb) {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            }
        })
    };
    
    const upload = multer(configMulter).single('file');

    
    upload( req, res, async (error) => {

        if (!error) {
            res.json({ file: req.file.filename });
        } else {
            console.log( error );
            return next();
        }
    });
};

const deleteFile = async ( req, res ) => {

    try {
        
        fs.unlinkSync(`./uploads/${ req.file }`);
        console.log('Archivo eliminado');

    } catch ( error ) {
        console.log( error );
    }
};

// Descargar archivo
const download = async ( req, res, next  ) => {

    // Obtiene enlace
    const link = await Link.findOne({ name: req.params.file });

    const file = './uploads/' + req.params.file;
    res.download(file);

    // Eliminar archivo y registro de BD
    // Si las descargas son iguales a 1 se borra el registro y el archivo
    const { downloads } = link;
    if ( link.downloads === 1) {
        
        // Eliminar archivo 
        req.file = link.name;
        

        // Eliminar registro de BD
        await Link.findByIdAndDelete( link._id );

        next();

    } else {
        // Si las descargas son mayores a 1 se resta 1 al campo descargas
        link.downloads--;
        await link.save();
    }

};

export {
    uploadFile,
    deleteFile,
    download
}