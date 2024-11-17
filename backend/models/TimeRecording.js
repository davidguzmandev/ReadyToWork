const mongoose = require('mongoose');

const timeRecordingSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // ID del registro
  name: { type: String, required: true }, // Nombre del usuario
  email: { type: String, required: true }, // Email del usuario
  client: { type: String, required: true }, // Cliente
  work: { 
    Commercial: { type: Boolean, required: false },
    Supervisor: { type: Boolean, required: false },
    Residential: { type: Boolean, required: false },
    Displacement: { type: Boolean, required: false }
  }, // Trabajo realizado, usando un objeto con claves de trabajos y valores booleanos
  date: { type: String, required: true }, // Fecha del registro
  hourOpen: { type: String, required: true }, // Hora de entrada
  km: { type: String, required: false }, // Kilómetros
  comments: { type: String, required: false }, // Comentarios
  location: {
    latitude: { type: Number, required: true }, // Latitud
    longitude: { type: Number, required: true } // Longitud
  },
  open: { type: Boolean, required: true }, // Indica si está abierto
  punchOutTime: { type: String, required: false }, // Hora de salida
  punchOutLocation: {
    latitude: { type: Number, required: false }, // Latitud de salida
    longitude: { type: Number, required: false } // Longitud de salida
  },
  duration: { type: String, required: false } // Duración del trabajo
});

const TimeRecording = mongoose.model('TimeRecording', timeRecordingSchema, 'records');

module.exports = TimeRecording;
