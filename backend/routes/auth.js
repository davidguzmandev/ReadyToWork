const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importar el modelo de usuario
const {authenticateToken, authorizeRoles}  = require('../middleware/auth');  // Importa los middleware de autenticación
const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, role: role || 'guest' });
        await newUser.save();

        res.status(201).json({ message: 'Usuario creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

//Recibe la solicitud get del frontend y la convierte a post, esto por el problema CORS
router.get('/user', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        // Aquí usamos `req.user` para acceder a la información del usuario decodificada desde el token
        const user = await User.findById(req.user.id);  // Suponiendo que el token contiene el id del usuario
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);  // Devuelve los datos del usuario
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Iniciar sesión
router.post('/', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    try {
        // Buscar el usuario en la base de datos
        if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' });

        const token = jwt.sign(
            { email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

         // Configurar la cookie de sesión (sin maxAge)
         res.cookie('authToken', token, {
            httpOnly: true,       // Solo accesible desde el servidor
            sameSite: 'strict',   // Protección contra CSRF
        });

        // Devuelve el token y el usuario (sin la contraseña)
        const { password: _, ...userWithoutPassword } = user.toObject(); // Desestructuración para eliminar la contraseña
        res.json({ token, user: userWithoutPassword }); // Devuelve el token y el usuario
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;
