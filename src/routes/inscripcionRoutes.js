const express = require('express');
const router = express.Router();
const {
    registrarInscripcion,
    obtenerInscripcionPorId,
    listarInscripciones,
    cancelarInscripcion
} = require('../controllers/inscripcionController');

// RF-01: Endpoint para registrar una inscripción (Método POST)
router.post('/inscripciones', registrarInscripcion);

// RF-03: Endpoint para listar todas las inscripciones (Método GET)
router.get('/inscripciones', listarInscripciones);

// RF-02: Endpoint para consultar una inscripción por ID (Método GET con parámetro :id)
router.get('/inscripciones/:id', obtenerInscripcionPorId);

// RF-04: Endpoint para cancelar una inscripción (Método PUT)
router.put('/inscripciones/:id/cancelar', cancelarInscripcion);

module.exports = router;