const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const usersFilePath = path.join(__dirname, '../data/users.json');

// Leer usuarios desde el archivo JSON
const getUsers = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Escribir usuarios al archivo JSON
const saveUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Registro de usuario NO ACTIVA POR AHORA
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
router.post('/', async (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();
    const user = users.find(user => user.email === email);

    try {
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
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;
