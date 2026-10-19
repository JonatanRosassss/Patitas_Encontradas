import { PreguntaFrecuente } from '@/types/Ticket';

/**
 * Preguntas frecuentes directamente vinculadas a los Requerimientos Funcionales (RF#1 a RF#4)
 * de Patitas Encontradas en Pilar.
 */
export const PREGUNTAS_FRECUENTES: PreguntaFrecuente[] = [
  {
    id: 'faq-1',
    categoria: 'PUBLICACIONES',
    pregunta: '¿Cómo publico una alerta de mascota perdida o encontrada?',
    respuesta:
      'Desde la pestaña "Publicar", seleccioná si la mascota está perdida o si fue avistada/encontrada. Completá los datos obligatorios (especie, descripción, foto y ubicación en el mapa de Pilar). Al confirmar, la alerta se publicará con estado ACTIVO para toda la comunidad.',
  },
  {
    id: 'faq-2',
    categoria: 'PUBLICACIONES',
    pregunta: '¿Cómo puedo editar o dar de baja mi publicación una vez resuelto el caso?',
    respuesta:
      'Ingresá a tu "Perfil", buscá la publicación en tu lista de alertas y tocá el botón de eliminar o marcar como resuelto. Solo el usuario titular que creó la alerta tiene privilegios para modificarla o cerrarla.',
  },
  {
    id: 'faq-3',
    categoria: 'PUBLICACIONES',
    pregunta: '¿Es obligatorio ofrecer una recompensa?',
    respuesta:
      'No, el campo de recompensa es completamente optativo. Podés indicarlo si querés incentivar la búsqueda comunitaria, pero no es necesario para crear la publicación.',
  },
  {
    id: 'faq-4',
    categoria: 'MAPA',
    pregunta: '¿Por qué no puedo ver mi ubicación actual en el mapa?',
    respuesta:
      'Asegurate de haber otorgado permisos de localización (GPS) a la aplicación desde la configuración de tu teléfono. El mapa utiliza OpenStreetMap / Leaflet y necesita acceso a tus coordenadas para centrarse en tu posición.',
  },
  {
    id: 'faq-5',
    categoria: 'MAPA',
    pregunta: '¿Cómo filtro las mascotas en el mapa?',
    respuesta:
      'En la pantalla del Mapa, utilizá los botones superiores para alternar entre "Todos", "Perdidos" o "Encontrados", o utilizá el buscador para escribir el nombre de la calle, barrio o localidad de Pilar.',
  },
  {
    id: 'faq-6',
    categoria: 'AVISTAMIENTOS',
    pregunta: '¿Qué hago si veo en la calle a una mascota que está publicada?',
    respuesta:
      'Tocá la publicación de la mascota en el mapa o feed. Podés contactar directamente al dueño presionando el botón de WhatsApp, o registrar un avistamiento enviando las coordenadas y una foto reciente.',
  },
  {
    id: 'faq-7',
    categoria: 'AVISTAMIENTOS',
    pregunta: '¿Cómo me comunico con el dueño de una mascota?',
    respuesta:
      'Al presionar el botón de contacto en la ficha de la mascota, la aplicación abrirá automáticamente una conversación de WhatsApp con el número telefónico registrado por el dueño.',
  },
  {
    id: 'faq-8',
    categoria: 'CUENTA',
    pregunta: '¿Cómo cambio mi número de teléfono o zona de residencia?',
    respuesta:
      'Podés actualizar los datos de tu perfil comunitario en la pestaña "Perfil". Mantené tu teléfono de WhatsApp actualizado para que los vecinos puedan comunicarse de inmediato en caso de novedades.',
  },
  {
    id: 'faq-9',
    categoria: 'CUENTA',
    pregunta: '¿Qué hago si olvidé mi contraseña?',
    respuesta:
      'En la pantalla de inicio de sesión, tocá en "¿Olvidaste tu contraseña?". Ingresá tu correo electrónico registrado y te enviaremos un enlace oficial de Firebase para restablecerla de forma segura.',
  },
];
