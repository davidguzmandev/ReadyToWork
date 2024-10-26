const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const authRoutes = require('./routes/auth');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000; // Puerto para el servidor

//Middleware
app.use(cors());
app.use(express.json());

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// Rutas
app.use('/api/auth/', authRoutes);

// Endpoint para leer el archivo clients.json
app.get('/api/clients', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'clients.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo' });
        }
        res.json(JSON.parse(data));
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});