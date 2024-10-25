const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const port= 5000 // Puerto para el servidor

//Middleware
app.use(cors());
app.use(bodyParser.json());

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

// Rutas de ejemplo
app.post('/api/registro', upload.single('foto'), (req, res) => {
    // Manejo de datos recibidos (req.body y req.file)
    res.json({ mensaje: 'Registro exitoso', data: req.body });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});