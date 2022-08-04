import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import cors from "cors";



const app = express();
app.use( express.json() );


dotenv.config();

connectDB();


// Habilitar Cors
const opcionesCors = {
    origin: process.env.FRONTEND_URL
}
app.use( cors(opcionesCors) );

// Habilita carpeta publica
app.use(express.static('uploads'));


// Rutas
app.use('/api/users', userRoutes );
app.use('/api/links', linkRoutes );
app.use('/api/files', fileRoutes );

const port = process.env.PORT || 4000;

app.listen( port, '0.0.0.0', () => {
    console.log('Servidor corriendo en el puerto ', port );
});