import mongoose from "mongoose";
import bcrypt from 'bcrypt';


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Elimina espacios en blanco al principio y al final de la cadena
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true, // convertir string a minusculas
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    token: {
        type: String,
    },
}, {
    timestamps: true
});

// Se ejecuta antes de almacenar un nuevo regsitro en la BD
userSchema.pre('save', async function ( next ) {
    // Comprueba si el password ha sido modificado no se actualizara el antiguo password
    if ( !this.isModified('password') ) { 
        next();
    }

    const salt      = await bcrypt.genSalt( 10 );
    this.password   = await bcrypt.hash( this.password, salt );
})

// Comparar contraseña del usuario desde formulario login con la de BD
userSchema.methods.checkPassword = async function ( formPassword ) {
    return await bcrypt.compare( formPassword, this.password );
}


const User = mongoose.model("User", userSchema);
export default User;