const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const usersFilePath = path.join(__dirname, '../data/users.json');

// Contraseña sin encriptar, Borrar cuando se implemente el registro
const plainPassword = "123";

// Encripta la contraseña
bcrypt.hash(plainPassword, 10, (err, hash) => {
    if (!err) {
        console.log("Contraseña encriptada:", hash);
        // Actualiza el archivo JSON con este hash como valor de "password"
    } else {
        console.error("Error encriptando la contraseña:", err);
    }
});


// Leer usuarios desde el archivo JSON
const getUsers = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo de usuarios:', error);
        return [];
    }
};

// Escribir usuarios al archivo JSON
const saveUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Registro de usuario
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = getUsers();
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'Usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { email, password: hashedPassword };
        users.push(newUser);
        saveUsers(users);
        res.status(201).json({ message: 'Usuario creado con éxito' });
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar el usuario' });
    }
});

// Iniciar sesión
router.post('/home', async (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();
    const user = users.find(user => user.email === email);
    console.log('Contenido de req.body:', req.body);
    console.log("Email recibido:", req.body.email);  // Para verificar el valor
    console.log("Password recibido:", password);

    try {
        if (!user) {
            console.log('no email' + user);
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('no password');
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;