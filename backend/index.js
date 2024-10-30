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

//Ruta para guardar los datos de horas en el JSON
app.post('/api/saveData', (req, res) => {
    
    const data = req.body.data;
    //Directorio donde se guardaran los datos
    const filePath = path.join(__dirname, 'data', 'timeRecording.json');

    //Leer los datos existentes
    fs.readFile(filePath, 'utf8', (err, fileData) => {
        
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ error: 'Error al leer el archivo' });
        }

        let jsonData = [];

        // Verificar si hay datos existentes en el archivo
        if (fileData) {
            jsonData = JSON.parse(fileData);
        }

        // Agregar los nuevos datos
        jsonData.push(data);

        // Guardar los datos actualizados en el archivo
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error al escribir en el archivo:', err);
                return res.status(500).json({ error: 'Error al guardar los datos' });
            }

            res.status(200).json({ message: 'Datos guardados exitosamente' });
        });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});