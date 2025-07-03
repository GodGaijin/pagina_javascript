const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '2h';

const ADMIN_CODE = '10052019';

const generateTokens = (user) => {
  const payload = { id: user.id, username: user.username, role: user.role };
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  return { accessToken, refreshToken };
};

exports.register = (req, res) => {
  const { username, password, role, adminCode } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Nombre de usuario y contraseña requeridos.' });
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'La contraseña debe contener al menos una letra, un número y un caracter especial.' });
  }
  if (role === 'admin' && adminCode !== ADMIN_CODE) {
    return res.status(403).json({ message: 'Código de administrador incorrecto.' });
  }
  userModel.findUserByUsername(username, (err, user) => {
    if (user) return res.status(409).json({ message: 'El nombre de usuario ya existe.' });
    userModel.createUser(username, password, role || 'user', (err, userId) => {
      if (err) return res.status(500).json({ message: 'Error al crear el usuario.' });
      res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  userModel.findUserByUsername(username, (err, user) => {
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas.' });
    if (!userModel.validatePassword(user, password)) return res.status(401).json({ message: 'Credenciales inválidas.' });
    const tokens = generateTokens(user);
    res.json(tokens);
  });
};

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Token de actualización requerido.' });
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token de actualización inválido.' });
    const tokens = generateTokens(user);
    res.json(tokens);
  });
}; 