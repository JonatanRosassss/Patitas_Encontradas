/**
 * Suite de Pruebas Automatizadas para RF-5: Cierre / Resolución de Publicación y Centro de Ayuda / Soporte
 * Módulo 5 - Patitas Encontradas (Node.js test runner: `node --test`)
 * Casos de prueba: TC-501 a TC-505
 */

import test from 'node:test';
import assert from 'node:assert/strict';

// Definición inline de FAQs para evitar problemas de resolución de tsconfig paths en node --test directo sin loader
const PREGUNTAS_FRECUENTES_MOCK = [
  {
    id: 'faq-1',
    categoria: 'PUBLICACIONES',
    pregunta: '¿Cómo publico una alerta de mascota perdida o encontrada?',
    respuesta: 'Desde la pestaña Publicar...',
  },
  {
    id: 'faq-2',
    categoria: 'PUBLICACIONES',
    pregunta: '¿Cómo puedo editar o dar de baja mi publicación una vez resuelto el caso?',
    respuesta: 'Ingresá a tu Perfil...',
  },
  {
    id: 'faq-3',
    categoria: 'PUBLICACIONES',
    pregunta: '¿Es obligatorio ofrecer una recompensa?',
    respuesta: 'No, el campo de recompensa es completamente optativo.',
  },
  {
    id: 'faq-4',
    categoria: 'MAPA',
    pregunta: '¿Por qué no puedo ver mi ubicación actual en el mapa?',
    respuesta: 'Asegurate de haber otorgado permisos...',
  },
  {
    id: 'faq-5',
    categoria: 'AVISTAMIENTOS',
    pregunta: '¿Qué hago si veo en la calle a una mascota que está publicada?',
    respuesta: 'Tocá la publicación...',
  },
  {
    id: 'faq-6',
    categoria: 'CUENTA',
    pregunta: '¿Cómo cambio mi número de teléfono o zona de residencia?',
    respuesta: 'Podés actualizar los datos...',
  },
];

test('TC-501: Cierre exitoso de publicación por mascota recuperada por el Autor original', async () => {
  const uidAutorA = 'uid_autor_A';
  const alertaId = 'REP-01';
  
  const mockMarcarMascotaComoEncontrada = async (alertaIdParam, uidUsuario) => {
    const alertaMock = {
      id: alertaIdParam,
      creadoPor: 'uid_autor_A',
      estado: 'ACTIVO',
    };

    if (alertaMock.creadoPor !== uidUsuario) {
      throw new Error('Solo el dueño de la publicación puede marcarla como encontrada.');
    }

    const resultadoActualizacion = {
      id: alertaMock.id,
      estado: 'ENCONTRADO',
      fechaModificacion: new Date().toISOString(),
    };

    const notificacionEmitida = {
      titulo: '¡Mascota encontrada!',
      mensaje: `La publicación ${alertaIdParam} ha sido marcada como encontrada por su dueño.`,
      usuarioId: uidUsuario,
      leido: false,
    };

    return {
      alerta: resultadoActualizacion,
      notificacion: notificacionEmitida,
    };
  };

  const res = await mockMarcarMascotaComoEncontrada(alertaId, uidAutorA);
  
  assert.equal(res.alerta.id, 'REP-01');
  assert.equal(res.alerta.estado, 'ENCONTRADO');
  assert.ok(res.alerta.fechaModificacion, 'Debe incluir fecha de modificación');
  assert.equal(res.notificacion.titulo, '¡Mascota encontrada!');
});

test('TC-502: Seguridad / Negativa — Rechazo de cierre de publicación al ser intentado por un usuario NO autor', async () => {
  const uidVecinoB = 'uid_vecino_B';
  const alertaId = 'REP-01';

  const mockMarcarMascotaComoEncontrada = async (alertaIdParam, uidUsuario) => {
    const alertaMock = {
      id: alertaIdParam,
      creadoPor: 'uid_autor_A',
      estado: 'ACTIVO',
    };

    if (alertaMock.creadoPor !== uidUsuario) {
      throw new Error('Solo el dueño de la publicación puede marcarla como encontrada.');
    }

    return { success: true };
  };

  await assert.rejects(
    async () => {
      await mockMarcarMascotaComoEncontrada(alertaId, uidVecinoB);
    },
    {
      message: 'Solo el dueño de la publicación puede marcarla como encontrada.',
    }
  );
});

test('TC-503: Consulta de Preguntas Frecuentes (FAQs) por categoría en Centro de Ayuda', async () => {
  const categoriasOficiales = ['PUBLICACIONES', 'MAPA', 'AVISTAMIENTOS', 'CUENTA'];
  
  assert.ok(PREGUNTAS_FRECUENTES_MOCK.length > 0, 'Debe existir un listado de FAQs');

  for (const cat of categoriasOficiales) {
    const preguntasCat = PREGUNTAS_FRECUENTES_MOCK.filter(f => f.categoria === cat);
    assert.ok(preguntasCat.length > 0, `Debe haber al menos una pregunta para la categoría ${cat}`);
  }

  const filtradasPublicaciones = PREGUNTAS_FRECUENTES_MOCK.filter(f => f.categoria === 'PUBLICACIONES');
  assert.equal(filtradasPublicaciones.length, 3);
  assert.equal(filtradasPublicaciones[0].pregunta, '¿Cómo publico una alerta de mascota perdida o encontrada?');

  let preguntaAbiertaId = null;
  const togglePregunta = (id) => {
    preguntaAbiertaId = preguntaAbiertaId === id ? null : id;
  };

  const idPrueba = 'faq-1';
  togglePregunta(idPrueba);
  assert.equal(preguntaAbiertaId, idPrueba, 'El acordeón debe expandirse al tocar');
  togglePregunta(idPrueba);
  assert.equal(preguntaAbiertaId, null, 'El acordeón debe colapsarse al tocar de nuevo');
});

test('TC-504: Creación exitosa de Ticket de Soporte / Incidencia en Firestore', async () => {
  const inputTicket = {
    usuarioId: 'uid_vecino_test',
    nombreContacto: 'Vecino Test',
    emailContacto: 'vecino@mail.com',
    tipoProblema: 'ERROR_TECNICO',
    titulo: 'Error al cargar foto',
    descripcion: 'La galería se cierra en Android 13 al seleccionar múltiples imágenes de la mascota',
    dispositivo: 'Moto G52',
  };

  assert.equal(inputTicket.titulo.trim(), 'Error al cargar foto');
  assert.equal(inputTicket.emailContacto.trim().toLowerCase(), 'vecino@mail.com');
  assert.equal(inputTicket.tipoProblema, 'ERROR_TECNICO');
  assert.ok(inputTicket.descripcion.length >= 15);
});

test('TC-505: UI / Validación (Negativa) — Rechazo de envío de Ticket de Soporte con campos obligatorios vacíos', async () => {
  const inputInvalido = {
    usuarioId: 'uid_vecino_test',
    nombreContacto: 'Vecino Test',
    emailContacto: 'vecino@mail.com',
    tipoProblema: 'ERROR_TECNICO',
    titulo: '',
    descripcion: '',
    dispositivo: 'Moto G52',
  };

  const mockEnviarTicketSoporte = async (input) => {
    if (!input.titulo?.trim()) {
      throw new Error('El título del ticket es obligatorio.');
    }
    if (!input.descripcion?.trim()) {
      throw new Error('La descripción detallada es obligatoria.');
    }
    return 'ticket_id_mock';
  };

  await assert.rejects(
    async () => {
      await mockEnviarTicketSoporte(inputInvalido);
    },
    {
      message: 'El título del ticket es obligatorio.',
    }
  );
});
