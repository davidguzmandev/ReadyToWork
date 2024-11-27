const express = require('express');
const router = express.Router();
const TimeRecording = require('../models/TimeRecording'); // Importar el modelo TimeRecording

// Obtener un trabajo por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const work = await TimeRecording.findOne({ id: id });
        if (!work) {
            return res.status(404).json({ error: 'Trabajo no encontrado' });
        }
        res.json(work);
    } catch (err) {
        console.error('Error al obtener el trabajo:', err);
        res.status(500).json({ error: 'Error al obtener el trabajo' });
    }
});

// Actualizar un trabajo por ID
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedWork = await TimeRecording.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedWork) {
            return res.status(404).json({ error: 'Trabajo no encontrado' });
        }
        res.json({ message: 'Trabajo actualizado correctamente', updatedWork });
    } catch (err) {
        console.error('Error al actualizar el trabajo:', err);
        res.status(500).json({ error: 'Error al actualizar el trabajo' });
    }
});

// Eliminar un trabajo por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedWork = await TimeRecording.findByIdAndDelete(id);
        if (!deletedWork) {
            return res.status(404).json({ error: 'Trabajo no encontrado' });
        }
        res.json({ message: 'Trabajo eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar el trabajo:', err);
        res.status(500).json({ error: 'Error al eliminar el trabajo' });
    }
});

module.exports = router;
