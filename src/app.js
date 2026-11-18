const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para leer JSON
app.use(express.json());

// Importar rutas
const inscripcionRoutes = require('./routes/inscripcionRoutes');

// Usar rutas en la API
app.use('/api', inscripcionRoutes);

// Ruta de prueba inicial
app.get('/', (req, res) => {
    res.json({ mensaje: "Servidor de la API de Talleres activo y corriendo correctamente" });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
