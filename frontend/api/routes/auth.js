const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importar el modelo de usuario
const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Usuario ya existe' });
        }

        // Hashear la contraseña y guardar el nuevo usuario
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Usuario creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

//Recibe la solicitud get del frontend y la convierte a post, esto por el problema CORS
router.get('/', async (req, res) => {
    console.log('Entro al get de login');
    const { email, password } = req.query; // Se usa query en lugar de body
    
    // Llamar directamente a la lógica de autenticación, como si fuera un POST
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json({ token, user: userWithoutPassword });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Iniciar sesión
router.post('/', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    try {
        console.log('Sesion iniciada');
        // Buscar el usuario en la base de datos
        if (!user) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Devuelve el token y el usuario (sin la contraseña)
        const { password: _, ...userWithoutPassword } = user.toObject(); // Desestructuración para eliminar la contraseña
        res.json({ token, user: userWithoutPassword }); // Devuelve el token y el usuario
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;
