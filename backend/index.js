const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const authRoutes = require('./routes/auth');
const recordRoutes = require('./routes/record');
const fs = require('fs');
const XLSX = require('xlsx');
const connectDB = require('./routes/db');
require('dotenv').config();
connectDB(); // Conectar a MongoDB

const Client = require('./models/Client'); // Importar el modelo Client
const TimeRecording = require('./models/TimeRecording'); // Importar el modelo TimeRecording
const app = express();

// Configuración de CORS
const corsOptions = {
    origin: '*', // Permite solicitudes desde cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'], // Encabezados permitidos
    credentials: true, // Si necesitas permitir cookies o autenticación en las solicitudes
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
app.use('/api/auth', authRoutes);
app.use('/api/user', authRoutes);
app.use('/api/record/', recordRoutes);

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

// Endpoint para leer el archivo antes: timeRecording.json ahora desde MongoDB
app.get('/api/time', async (req, res) => {
    try {
        // Consulta todos los registros de tiempo en la base de datos
        const timeRecords = await TimeRecording.find();
        res.json(timeRecords); // Enviar los datos al cliente en formato JSON
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los registros de tiempo' });
    }
});

app.patch('/api/timePunchOut', async (req, res) => {
    const { id, punchOutTime, punchOutLocation, punchOutDate, open, comment2, duration } = req.body;

    try {
        // Buscar el registro en MongoDB por el ID
        const record = await TimeRecording.findOne({ id });

        if (!record) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }

/*         // Obtener los valores de hourOpen y punchOutTime y calcular la duración
        const hourOpen = new Date(`${record.date}T${record.hourOpen}:00`);
        const punchOut = new Date(`${punchOutDate}T${punchOutTime}:00`);

        // Calcular la diferencia de tiempo entre ambos puntos
        const timeDifference = punchOut - hourOpen;

        if (timeDifference < 0) {
            return res.status(400).json({ error: 'Punch-out time cannot be before punch-in time' });
        }

        const totalMinutes = Math.floor(timeDifference / (1000 * 60));
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;

        const duration = `${totalHours}h ${remainingMinutes}m`; */

        // Actualizar los campos en el documento encontrado
        record.punchOutTime = punchOutTime;
        record.punchOutDate = punchOutDate;
        record.punchOutLocation = punchOutLocation;
        record.open = open;
        record.duration = duration;
        record.comment2 = comment2;

      // Guardar el registro actualizado en MongoDB
      await record.save();
      res.status(200).json({ message: 'Punch-out registrado correctamente' });

  } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

//Ruta para guardar los datos de horas en el JSON
app.post('/api/saveData', async (req, res) => {
    const data = req.body.data;

    try {
        // Crear un nuevo registro en la base de datos utilizando el modelo
        const newRecord = new TimeRecording(data);

        // Guardar el nuevo registro en MongoDB
        await newRecord.save();

        res.status(200).json({ message: 'Datos guardados exitosamente' });
    } catch (err) {
        console.error('Error al guardar los datos:', err);
        return res.status(500).json({ error: 'Error al guardar los datos' });
    }
});

// Endpoint para exportar los datos a Excel
app.get('/api/exportExcel', async (req, res) => {
    try {
        // Obtener todos los registros de MongoDB
        const records = await TimeRecording.find();

        // Convertir los registros a formato adecuado para Excel
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
            'Open Comment': record.comment1,
            'Close Comment': record.comment2,
            'Start Location Latitude': record.location.latitude,
            'Start Location Longitude': record.location.longitude,
            'End Location Latitude': record.punchOutLocation?.latitude,
            'End Location Longitude': record.punchOutLocation?.longitude,
            'Is Open': record.open
        }));

        // Crear un libro de trabajo y una hoja de Excel
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Time Records');

        // Generar el archivo Excel en un buffer
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        // Configurar encabezados para la respuesta de descarga
        res.setHeader('Content-Disposition', 'attachment; filename="timeRecording.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Enviar el buffer como respuesta
        res.send(excelBuffer);
    } catch (err) {
        console.error('Error al procesar los datos:', err);
        return res.status(500).json({ error: 'Error al obtener los registros' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});