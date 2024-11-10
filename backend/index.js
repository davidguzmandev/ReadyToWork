const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const authRoutes = require('./routes/auth');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const connectDB = require('./routes/db');
require('dotenv').config();
connectDB(); // Conectar a MongoDB

const Client = require('./models/Client'); // Importar el modelo Client
const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL

// Configuración de CORS
const corsOptions = {
    origin: '*', // Permite solicitudes de tu frontend
    methods: ['GET', 'POST'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
  };

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const port = process.env.PORT || 3001; // Puerto para el servidor

//Middleware

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Endpoint para obtener los clientes desde MongoDB
app.get('/api/clients', async (req, res) => {
    try {
        const clients = await Client.find(); // Obtener todos los clientes de MongoDB
        res.json(clients); // Enviar los clientes como respuesta
    } catch (err) {
        console.error('Error al obtener los clientes:', err);
        return res.status(500).json({ error: 'Error al obtener los clientes' });
    }
});

// Endpoint para leer el archivo timeRecording.json
app.get('/api/time', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'timeRecording.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo' });
        }
        res.json(JSON.parse(data));
    });
});

app.patch('/api/timePunchOut', (req, res) => {
    const { id, punchOutTime, punchOutLocation, open } = req.body;
    const filePath = path.join(__dirname, 'data', 'timeRecording.json');
  
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo:', err);
        return res.status(500).json({ error: 'Error al leer el archivo' });
      }
  
      // Parsear y buscar el registro por ID
      let records = JSON.parse(data);
      const recordIndex = records.findIndex((record) => record.id === id);
  
      if (recordIndex === -1) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }
  
      // Obtener los valores de hourOpen y punchOutTime y calcular la duración
      const hourOpen = new Date(`1970-01-01T${records[recordIndex].hourOpen}:00`);
      const punchOut = new Date(`1970-01-01T${punchOutTime}:00`);
      const timeDifference = punchOut - hourOpen;

      // Convertir la diferencia a horas y minutos
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const duration = `${hours}h ${minutes}m`;

      // Actualizar la hora y ubicación de punch-out ademas del campo open
      records[recordIndex] = {
        ...records[recordIndex],
        punchOutTime,
        punchOutLocation,
        open,
        duration
      };
  
      // Guardar el archivo actualizado
      fs.writeFile(filePath, JSON.stringify(records, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error al escribir en el archivo:', writeErr);
          return res.status(500).json({ error: 'Error al guardar los datos' });
        }
        res.status(200).json({ message: 'Punch-out registrado correctamente' });
      });
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

// Endpoint para exportar los datos a Excel
app.get('/api/exportExcel', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'timeRecording.json');

    // Leer los datos de timeRecording.json
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error al leer el archivo:', err);
          return res.status(500).json({ error: 'Error al leer el archivo' });
        }
        // Parsear el JSON y convertirlo a una hoja de Excel
        const records = JSON.parse(data);
        const workbook = XLSX.utils.book_new();
        
        const excelData = records.map(record => ({
            'Email': record.email,
            'Employee Name': record.name,
            'Date': record.date,
            'Type': record.work,
            'Client': record.client,
            'Start Time': record.hourOpen,
            'End Time': record.punchOutTime,
            'Working Hours': record.duration,
            'Kilometers': record.km,
            'Comments': record.comments,
            'Start Location Latitude': record.location.latitude,
            'Start Location Longitude': record.location.longitude,
            'End Location Latitude': record.punchOutLocation?.latitude,
            'End Location Longitude': record.punchOutLocation?.longitude,
            'Is Open': record.open
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Time Records');

        // Generar un archivo Excel temporal
        const excelFilePath = path.join(__dirname, 'data', 'timeRecording.xlsx');
        XLSX.writeFile(workbook, excelFilePath);

        // Enviar el archivo Excel al cliente
        res.download(excelFilePath, 'timeRecording.xlsx', (downloadErr) => {
            if (downloadErr) {
                console.error('Error al descargar el archivo:', downloadErr);
                return res.status(500).json({ error: 'Error al descargar el archivo' });
            }

            // Eliminar el archivo temporal después de enviarlo
            fs.unlink(excelFilePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error al eliminar el archivo temporal:', unlinkErr);
                }
            });
        });
    });
});

// Iniciar el servidor
app.listen(port,'0.0.0.0', () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${port}`);
});