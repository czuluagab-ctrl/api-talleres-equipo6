const { inscripciones, talleres } = require('../models/data');

// RF-01: Registrar inscripción con validaciones de negocio
const registrarInscripcion = (req, res) => {
    const { id_estudiante, id_taller } = req.body;

    // 1. Validar si el taller existe
    const taller = talleres.find(t => t.id_taller === id_taller);
    if (!taller) {
        return res.status(400).json({ mensaje: "El taller no existe" });
    }

    // 2. Validar si hay cupos disponibles
    if (taller.cupos <= 0) {
        return res.status(400).json({ mensaje: "No hay cupos disponibles en este taller" });
    }

    // 3. Validar duplicados (que el estudiante no esté ya inscrito activamente)
    const yaInscrito = inscripciones.some(
        i => i.id_estudiante === id_estudiante && i.id_taller === id_taller && i.estado === "ACTIVA"
    );

    if (yaInscrito) {
        return res.status(400).json({ mensaje: "El estudiante ya está inscrito en este taller" });
    }

    // 4. Descontar cupo y crear la inscripción
    taller.cupos -= 1;

    const nuevaInscripcion = {
        id_inscripcion: `INS-${101 + inscripciones.length}`,
        id_estudiante,
        id_taller,
        estado: "ACTIVA",
        fecha_registro: new Date().toISOString()
    };

    inscripciones.push(nuevaInscripcion);

    return res.status(201).json({
        mensaje: "Inscripción registrada con éxito",
        inscripcion: nuevaInscripcion,
        cupos_restantes_taller: taller.cupos
    });
};

// RF-02: Consultar una inscripción por su ID
const obtenerInscripcionPorId = (req, res) => {
    const { id } = req.params;
    const inscripcion = inscripciones.find(i => i.id_inscripcion === id);

    if (!inscripcion) {
        return res.status(404).json({ mensaje: "Inscripción no encontrada" });
    }

    return res.status(200).json(inscripcion);
};

// RF-03: Listar todas las inscripciones
const listarInscripciones = (req, res) => {
    return res.status(200).json(inscripciones);
};

// RF-04: Cancelar una inscripción y liberar el cupo
const cancelarInscripcion = (req, res) => {
    const { id } = req.params;
    const inscripcion = inscripciones.find(i => i.id_inscripcion === id);

    if (!inscripcion) {
        return res.status(404).json({ mensaje: "Inscripción no encontrada" });
    }

    if (inscripcion.estado === "CANCELADA") {
        return res.status(400).json({ mensaje: "La inscripción ya se encuentra cancelada" });
    }

    // Cambiar estado a cancelada
    inscripcion.estado = "CANCELADA";

    // Devolver el cupo al taller
    const taller = talleres.find(t => t.id_taller === inscripcion.id_taller);
    if (taller) {
        taller.cupos += 1;
    }

    return res.status(200).json({
        mensaje: "Inscripción cancelada con éxito",
        inscripcion,
        cupos_restantes_taller: taller ? taller.cupos : null
    });
};

module.exports = {
    registrarInscripcion,
    obtenerInscripcionPorId,
    listarInscripciones,
    cancelarInscripcion
};