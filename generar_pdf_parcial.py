# -*- coding: utf-8 -*-
"""
Generador de la Guía de Defensa Oral y Examen Parcial - Patitas Encontradas
Genera un PDF profesional con ReportLab conteniendo el análisis exhaustivo de arquitectura,
justificación técnica archivo por archivo, y respuestas a preguntas típicas del docente.
"""

import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
    HRFlowable,
)
from reportlab.pdfgen import canvas

# --- PALETA DE COLORES OFICIAL DE PATITAS ENCONTRADAS ---
COLOR_PRIMARY = colors.HexColor("#FF8A00")       # Naranja Principal
COLOR_PRIMARY_DARK = colors.HexColor("#D47000")  # Naranja Oscuro
COLOR_SECONDARY = colors.HexColor("#5A3A1F")     # Marrón Texto
COLOR_ACCENT = colors.HexColor("#FFE7D2")        # Durazno Claro
COLOR_BG_CARD = colors.HexColor("#FAF8F5")       # Fondo Tarjetas
COLOR_WHITE = colors.HexColor("#FFFFFF")         # Blanco
COLOR_BORDER = colors.HexColor("#E8DFD8")        # Borde
COLOR_TEXT = colors.HexColor("#2B2D42")          # Texto Principal
COLOR_TEXT_MUTED = colors.HexColor("#7D8597")    # Texto Secundario
COLOR_SUCCESS = colors.HexColor("#2E7D32")       # Verde Éxito
COLOR_SUCCESS_BG = colors.HexColor("#E8F5E9")    # Verde Fondo
COLOR_CODE_BG = colors.HexColor("#F4EFEA")       # Fondo Bloque Código
COLOR_LIGHT_GRAY = colors.HexColor("#F2F2F2")

class NumberedCanvas(canvas.Canvas):
    """
    Canvas personalizado de 2 pasadas para calcular y dibujar el número total
    de páginas, encabezado y pie de página en cada hoja sin caracteres especiales.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, num_pages):
        # Omitir decoraciones en la portada (página 1)
        if self._pageNumber == 1:
            return

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(COLOR_TEXT_MUTED)

        # Encabezado superior
        self.drawString(54, 750, "Patitas Encontradas - Guia de Examen y Defensa Oral de Arquitectura")
        self.setStrokeColor(COLOR_BORDER)
        self.setLineWidth(0.5)
        self.line(54, 742, 558, 742)

        # Pie de página inferior
        self.line(54, 45, 558, 45)
        self.drawString(54, 32, "Universidad Nacional de Pilar | Catedra de Desarrollo Movil (UNP 2026)")
        page_text = f"Pagina {self._pageNumber} de {num_pages}"
        self.drawRightString(558, 32, page_text)

        self.restoreState()


def create_study_guide_pdf(output_filename="Guia_Defensa_Parcial_Patitas_Encontradas.pdf"):
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54,
    )

    styles = getSampleStyleSheet()

    # --- ESTILOS PERSONALIZADOS ---
    style_cover_title = ParagraphStyle(
        "CoverTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=30,
        textColor=COLOR_PRIMARY,
        alignment=0,
        spaceAfter=6,
    )

    style_cover_subtitle = ParagraphStyle(
        "CoverSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=COLOR_SECONDARY,
        spaceAfter=12,
    )

    style_h1 = ParagraphStyle(
        "Heading1_Custom",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=19,
        textColor=COLOR_PRIMARY_DARK,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True,
    )

    style_h2 = ParagraphStyle(
        "Heading2_Custom",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11.5,
        leading=15,
        textColor=COLOR_SECONDARY,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True,
    )

    style_body = ParagraphStyle(
        "Body_Custom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=COLOR_TEXT,
        spaceAfter=5,
    )

    style_body_bold = ParagraphStyle(
        "BodyBold_Custom",
        parent=style_body,
        fontName="Helvetica-Bold",
    )

    style_bullet = ParagraphStyle(
        "Bullet_Custom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.8,
        leading=12.5,
        textColor=COLOR_TEXT,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3,
    )

    style_callout = ParagraphStyle(
        "CalloutText",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.6,
        leading=12.2,
        textColor=COLOR_SECONDARY,
    )

    style_qa_q = ParagraphStyle(
        "QA_Question",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.8,
        leading=13.5,
        textColor=COLOR_PRIMARY_DARK,
        spaceBefore=7,
        spaceAfter=3,
        keepWithNext=True,
    )

    style_qa_a = ParagraphStyle(
        "QA_Answer",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.8,
        leading=12.8,
        textColor=COLOR_TEXT,
        spaceAfter=6,
    )

    story = []

    def make_box(title, text, bg_color=COLOR_BG_CARD, border_color=COLOR_PRIMARY, title_color=COLOR_PRIMARY):
        """Crea una caja destacada tipo alerta/callout"""
        content = [
            Paragraph(f"<b>{title}</b>", ParagraphStyle('BoxTitle', parent=style_body, fontName="Helvetica-Bold", textColor=title_color, fontSize=9.2, spaceAfter=2)),
            Paragraph(text, style_callout),
        ]
        t = Table([[content]], colWidths=[504])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg_color),
            ('BOX', (0,0), (-1,-1), 1, border_color),
            ('PADDING', (0,0), (-1,-1), 7),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ]))
        return t

    def make_file_card(filename, responsibility, key_tech, why_text):
        """Crea una tarjeta individual y completa para el analisis de cada archivo"""
        header_p = Paragraph(
            f"<b>Archivo:</b> <font color='#D47000'><code>{filename}</code></font><br/>"
            f"<b>Responsabilidad:</b> {responsibility}<br/>"
            f"<b>Tecnologias:</b> {key_tech}",
            style_body
        )
        content_p = Paragraph(f"<b>Por que se hizo asi:</b> {why_text}", style_body)

        t = Table([[header_p], [content_p]], colWidths=[504])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), COLOR_CODE_BG),
            ('BACKGROUND', (0,1), (-1,1), COLOR_WHITE),
            ('BOX', (0,0), (-1,-1), 0.75, COLOR_BORDER),
            ('LINEBELOW', (0,0), (-1,0), 0.5, COLOR_BORDER),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ]))
        return KeepTogether([t, Spacer(1, 6)])

    # =========================================================================
    # PORTADA Y RESUMEN EJECUTIVO
    # =========================================================================
    story.append(Paragraph("GUIA DEFINITIVA DE DEFENSA ORAL Y ARQUITECTURA", style_cover_title))
    story.append(Paragraph("PROYECTO: PATITAS ENCONTRADAS | EXAMEN PARCIAL INTEGRADOR", style_cover_subtitle))
    story.append(Paragraph("Catedra de Desarrollo de Aplicaciones Moviles - Tecnicatura Universitaria en Desarrollo de Software (UNP)", style_body_bold))
    story.append(Spacer(1, 10))

    meta_table_data = [
        [Paragraph("<b>Framework Core:</b>", style_body), Paragraph("React Native 0.86 + Expo SDK 57 (TypeScript 5.0+)", style_body)],
        [Paragraph("<b>Enrutamiento & Rutas:</b>", style_body), Paragraph("Expo Router (File-based navigation: Stacks + Tabs + Dynamic Routes)", style_body)],
        [Paragraph("<b>Estado Global & Stores:</b>", style_body), Paragraph("Zustand (Gestion ligera sin boilerplate ni Providers innecesarios)", style_body)],
        [Paragraph("<b>Backend as a Service:</b>", style_body), Paragraph("Firebase Auth + Firestore + Fallback con AuthMock offline", style_body)],
        [Paragraph("<b>Motor de Mapas:</b>", style_body), Paragraph("Leaflet 1.9.4 + OpenStreetMap en WebView desacoplado (Cero API Key)", style_body)],
        [Paragraph("<b>Validacion de Formularios:</b>", style_body), Paragraph("Zod (safeParse en tiempo de ejecucion) + React Hook Form", style_body)],
        [Paragraph("<b>Patron de Diseno:</b>", style_body), Paragraph("Atomic Design (ui/Button) + Container / Hook Custom Controller", style_body)],
    ]
    t_meta = Table(meta_table_data, colWidths=[150, 354])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_BG_CARD),
        ('BOX', (0,0), (-1,-1), 1, COLOR_PRIMARY),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('PADDING', (0,0), (-1,-1), 4.5),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 12))

    box_estrategia = make_box(
        "COMO RESPONDER EN EL EXAMEN FRENTE AL PROFESOR",
        "El profesor evaluara el <b>criterio de ingenieria</b> y la justificacion de las decisiones tomadas: "
        "<br/>1. <b>Seguridad y solidez:</b> Explica por que se eligio cada libreria (Zod, Zustand, Leaflet, AsyncStorage)."
        "<br/>2. <b>Resiliencia:</b> Destaca que la app cuenta con soporte de Firebase real y ademas un servicio de Mocks para pruebas offline."
        "<br/>3. <b>Solucion a problemas reales:</b> Como resolvieron la famosa pantalla negra de Google Maps en Android usando un puente WebView con Leaflet.",
        bg_color=COLOR_ACCENT,
        border_color=COLOR_PRIMARY,
        title_color=COLOR_SECONDARY
    )
    story.append(box_estrategia)
    story.append(Spacer(1, 10))

    # Indice rapido
    story.append(Paragraph("<b>ESTRUCTURA DE ESTE DOCUMENTO:</b>", style_body_bold))
    story.append(Paragraph("• <b>Bloque 1:</b> Las 7 Grandes Preguntas de Arquitectura que hara el docente.", style_bullet))
    story.append(Paragraph("• <b>Bloque 2:</b> Radiografia Exhaustiva Archivo por Archivo (por que se hizo como se hizo).", style_bullet))
    story.append(Paragraph("• <b>Bloque 3:</b> Simulador de Defensa Oral de 11 Preguntas y Respuestas Modelo.", style_bullet))

    story.append(PageBreak())

    # =========================================================================
    # BLOQUE 1: LAS 7 PREGUNTAS CLAVE DEL PROFESOR
    # =========================================================================
    story.append(Paragraph("BLOQUE 1: LAS 7 PREGUNTAS ESTRATEGICAS DEL PROFESOR", style_h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=COLOR_PRIMARY, spaceBefore=2, spaceAfter=8))

    # Pregunta 1: Mock Data
    q1_content = [
        Paragraph("1. «Hicieron las mock data? Como y por que?»", style_qa_q),
        Paragraph(
            "<b>Respuesta conceptual:</b> Si, implementamos una estrategia integral de datos simulados (Mock Data) estructurada y fuertemente tipada con TypeScript. "
            "En el desarrollo de software agil, el frontend y el backend evolucionan en paralelo. Si la interfaz dependiera exclusivamente de una API remota en la nube, "
            "cualquier caida de red, corte de Wi-Fi en el aula o retraso en las reglas de seguridad de la base de datos bloquearia las pruebas y la presentacion en vivo. "
            "Los mocks nos permiten garantizar una aplicacion deterministica y 100% testeable en cualquier momento.",
            style_qa_a
        ),
        Paragraph("<b>Donde y como estan implementadas en el codigo:</b>", style_body_bold),
        Paragraph("• <b>Mocks de Mapa (<code>data/mapMockData.ts</code>):</b> Contiene coordenadas geograficas reales y precisas de la localidad de Pilar (por ejemplo: Barrio Champagnat en -34.4497, -58.9194 y Plaza 12 de Octubre en -34.4587, -58.9142). Cada objeto cumple con el contrato de la interfaz <code>MapPet</code>, incluyendo foto remota de Unsplash, estado (1 = Perdido, 2 = Encontrado), descripcion y recompensa.", style_bullet),
        Paragraph("• <b>Mocks de Autenticacion (<code>services/authMock.ts</code>):</b> Declaramos el arreglo <code>USUARIOS_MOCK</code> y la funcion <code>simularInicioSesion()</code> con credenciales fijas pensadas para la evaluacion: <code>profesor@patitas.com / 123456</code>. Permite ingresar al sistema sin depender de conexion externa.", style_bullet),
        Paragraph("• <b>Mocks de Feed (<code>app/(tabs)/index.tsx</code>):</b> Array local <code>MASCOTAS</code> con perros, gatos y loros para renderizar el listado en <code>FlatList</code> de forma inmediata.", style_bullet),
    ]
    story.append(KeepTogether(q1_content))
    story.append(Spacer(1, 6))

    # Pregunta 2: Firebase
    q2_content = [
        Paragraph("2. «Pudieron ver de usar Firebase? Por que convive con los mocks?»", style_qa_q),
        Paragraph(
            "<b>Respuesta conceptual:</b> Si, el proyecto tiene instalado y configurado el SDK oficial de <b>Firebase v10 en <code>services/firebase.ts</code></b>. "
            "La arquitectura se diseno para permitir produccion con Firebase y testing local con mocks.",
            style_qa_a
        ),
        Paragraph("<b>El gran desafio tecnico de Firebase en React Native:</b>", style_body_bold),
        Paragraph(
            "En la Web tradicional, Firebase Auth guarda los tokens de sesion en el <code>localStorage</code> o <code>indexedDB</code> del navegador. "
            "<b>En React Native esos mecanismos web NO existen en el entorno nativo de Android e iOS.</b> "
            "Para solucionarlo, conectamos la persistencia nativa mediante <code>@react-native-async-storage/async-storage</code>: "
            "inicializamos la autenticacion mediante <code>initializeAuth(aplicacionFirebase, { persistence: getReactNativePersistence(AsyncStorage) })</code>. "
            "Ademas, utilizamos variables de entorno seguras con el estandar de Expo (prefijo <code>EXPO_PUBLIC_FIREBASE_*</code>) y un patron singleton "
            "(<code>getApps().length === 0 ? initializeApp(...) : getApp()</code>) para evitar que el Fast Refresh vuelva a instanciar Firebase innecesariamente.",
            style_qa_a
        ),
    ]
    story.append(KeepTogether(q2_content))
    story.append(Spacer(1, 6))

    # Pregunta 3: El Mapa y la Pantalla Negra
    q3_content = [
        Paragraph("3. «Como hicieron el mapa? Por que no usaron Google Maps / react-native-maps directamente?»", style_qa_q),
        Paragraph(
            "<b>Respuesta conceptual:</b> Reemplazamos la dependencia clasica de <code>react-native-maps</code> por un motor desacoplado basado en "
            "<b>Leaflet.js 1.9.4 dentro de <code>react-native-webview</code> con teselas raster de OpenStreetMap y CartoDB Voyager</b>.",
            style_qa_a
        ),
        Paragraph("<b>Por que se hizo asi (Solucion al bug de la pantalla negra):</b>", style_body_bold),
        Paragraph(
            "<code>react-native-maps</code> en Android exige obligatoriamente dos factores externos: 1) Google Play Services instalados en el dispositivo, "
            "y 2) una Google Cloud API Key configurada con facturacion activa en Google Cloud Platform. "
            "En emuladores de desarrollo de Android Studio, computadoras de laboratorio o telefonos sin servicios de Google, "
            "el mapa de Google falla de forma silenciosa y muestra un rectangulo negro vacio. "
            "<br/><b>Nuestra solucion:</b> "
            "<br/>1) <b>Cero costo y cero API Keys:</b> Funciona libremente en cualquier celular o emulador mediante OpenStreetMap."
            "<br/>2) <b>Puente Bidireccional (Event Bridge):</b> React Native envia instrucciones al mapa con <code>injectJavaScript</code> (`setMarkers`, `centerTo`, `zoomIn`, `selectPet`), "
            "y el mapa le responde a React Native mediante <code>window.ReactNativeWebView.postMessage()</code> enviando eventos tipados (`MAP_READY`, `MARKER_CLICK`, `MAP_CLICK`)."
            "<br/>3) <b>GPS Real:</b> Obtenemos la posicion con <code>expo-location</code> y la transmitimos al mapa mostrando un marcador pulsante tipo radar.",
            style_qa_a
        ),
    ]
    story.append(KeepTogether(q3_content))

    story.append(PageBreak())

    # Pregunta 4: Zustand
    q4_content = [
        Paragraph("4. «Que es Zustand? Por que se eligio y como se usa?»", style_qa_q),
        Paragraph(
            "<b>Respuesta conceptual:</b> <b>Zustand</b> es una libreria alemana de gestion de estado global para React y React Native basada en hooks. "
            "Es ultra liviana (menos de 2 KB), extremadamente veloz y no requiere envolver la aplicacion con componentes Provider.",
            style_qa_a
        ),
        Paragraph("<b>Comparativa tecnica contra Redux y Context API:</b>", style_body_bold),
        Paragraph("• <b>Frente a Redux:</b> Redux demanda una cantidad masiva de boilerplate (actions, reducers, types, dispatch, middleware). En una aplicacion movil donde la agilidad es vital, Redux complica el mantenimiento. En Zustand, un store completo se define en una sola funcion: <code>create((set) => ({ ... }))</code>.", style_bullet),
        Paragraph("• <b>Frente a Context API:</b> En React Context, cada vez que cambia una propiedad en el Provider, <b>se re-renderizan todos los componentes consumidores</b>, provocando saltos visuales en animaciones y listas de celulares. Ademas obliga a apilar Providers en el archivo raiz. Zustand <b>no necesita Provider</b> y permite suscripciones atomicas por selector (ej: <code>useCarritoStore(state => state.total)</code>), renderizando unicamente el componente que cambio.", style_bullet),
        Paragraph("• <b>Su rol en Patitas Encontradas:</b> Esta incorporada en las dependencias para gestionar el estado compartido: el carrito de compras de la Tienda Solidaria (donde se compran chapitas QR para sostener la app) y la sesion de usuario entre tabs.", style_bullet),
    ]
    story.append(KeepTogether(q4_content))
    story.append(Spacer(1, 6))

    # Pregunta 5: Botón Reutilizable y UI
    q5_content = [
        Paragraph("5. «Como lograron este boton y los componentes UI?»", style_qa_q),
        Paragraph(
            "<b>Respuesta conceptual:</b> Disenamos una biblioteca de componentes visuales basada en <b>Atomic Design</b>, "
            "creando el componente atomo <code>components/ui/Button.tsx</code>. Este boton resuelve tres desafios esenciales:",
            style_qa_a
        ),
        Paragraph("• <b>Polimorfismo para trabajo colaborativo:</b> Para que los diferentes desarrolladores del equipo pudieran usarlo sin friccion, el boton admite tanto la sintaxis web (<code>label</code> y <code>onClick</code>) como la sintaxis nativa de React Native (<code>title</code> y <code>onPress</code>), normalizandolas internamente.", style_bullet),
        Paragraph("• <b>Manejo de estados interactivos:</b> Si la prop <code>loading=true</code> esta activa, el boton oculta el texto y muestra un <code>ActivityIndicator</code> animado, deshabilitando el toque para impedir doble envio de formularios. Si <code>disabled=true</code>, atenua la opacidad al 50%.", style_bullet),
        Paragraph("• <b>Variantes de Marca y Sombras Hibridas:</b> Admite variantes <code>orange</code> (fondo solido naranja de la marca), <code>bWhite</code> (outline blanco con borde naranja) y <code>lightOrange</code>. En estilos, combina <code>shadowColor, shadowOffset, shadowRadius</code> para iOS con <code>elevation: 2</code> para el motor de renderizado de Android.", style_bullet),
    ]
    story.append(KeepTogether(q5_content))
    story.append(Spacer(1, 6))

    # Pregunta 6: Alertas y Validación en Login
    q6_content = [
        Paragraph("6. «Como se hace el mensaje de alerta y la validacion en login.tsx?»", style_qa_q),
        Paragraph(
            "<b>Respuesta conceptual:</b> En <code>app/(auth)/login.tsx</code> implementamos una arquitectura que combina "
            "validacion declarativa de esquemas con <b>Zod</b> y presentacion nativa de alertas con <b><code>Alert.alert</code></b> de React Native.",
            style_qa_a
        ),
        Paragraph("<b>El circuito paso a paso:</b>", style_body_bold),
        Paragraph("1. <b>Validacion con safeParse:</b> Usamos <code>loginSchema.safeParse({ email, contrasenia })</code>. La ventaja de <code>safeParse</code> sobre <code>parse</code> es que no lanza excepciones no controladas con <code>try/catch</code>, sino que retorna un objeto con <code>success: true/false</code> y un array tipado de errores.", style_bullet),
        Paragraph("2. <b>Extraccion del error amigable:</b> Si falla la validacion, extraemos el primer mensaje en espanol definido en el esquema: <code>resultado.error.errors[0]?.message</code>.", style_bullet),
        Paragraph("3. <b>Disparo del Alert Nativo:</b> Invocamos <code>Alert.alert('Atencion', errorMsg)</code>. Esto levanta el dialogo nativo del sistema operativo (AlertDialog en Android y UIAlertController en iOS), respetando el diseno y la accesibilidad del dispositivo del usuario.", style_bullet),
        Paragraph("4. <b>Navegacion encadenada:</b> Cuando el inicio de sesion es correcto, el Alert de bienvenida incluye un boton 'Continuar' con un callback: <code>onPress: () => router.replace('/(tabs)')</code>. Usar <code>replace</code> en lugar de <code>push</code> es fundamental: evita que el usuario vuelva a la pantalla de login si presiona el boton fisico 'Atras' de Android.", style_bullet),
    ]
    story.append(KeepTogether(q6_content))
    story.append(Spacer(1, 6))

    # Pregunta 7: Por qué no se usó Tailwind / NativeWind
    q7_content = [
        Paragraph("7. «Por que no se uso Tailwind / NativeWind si figura en package.json y en el README?»", style_qa_q),
        Paragraph(
            "<b>Respuesta conceptual:</b> Se evaluo e instalo NativeWind (Tailwind CSS para React Native) en la fase inicial de prototipado, "
            "pero el equipo tomo la decision tecnica consensuada de <b>priorizar StyleSheet.create junto a un Design System centralizado (constants/theme.ts y theme/tokens.ts)</b>. "
            "Esta decision de arquitectura se baso en 4 pilares fundamentales:",
            style_qa_a
        ),
        Paragraph("• <b>1. Cumplimiento estricto de CONVENCIONES.md (Regla 5 y 6):</b> El acuerdo formal del equipo establecio como estandar obligatorio: "
                  "<i>'Estilos al final del archivo mediante StyleSheet.create'</i> y <i>'Sin magic numbers ni colores fijos'</i>. "
                  "Tener los estilos al final mantiene el JSX de cada componente limpio, legible y facil de auditar en Pull Requests.", style_bullet),
        Paragraph("• <b>2. Tipado y autocompletado en TypeScript (Cero errores de compilacion):</b> En NativeWind, las clases como <code>className='bg-orange-500'</code> "
                  "son strings en runtime. Un simple error de tipeo (ej: <code>bg-ornage-500</code>) pasa desapercibido por el compilador y deja la pantalla rota. "
                  "En cambio, consumiendo tokens fuertemente tipados (<code>Colors.primary</code>, <code>Typography.fonts.titleBold</code>), "
                  "el compilador de TypeScript valida cada propiedad y previene cualquier error, permitiendo que <code>npx tsc --noEmit</code> compile con 0 errores.", style_bullet),
        Paragraph("• <b>3. Compatibilidad con Expo SDK 57 / React Native 0.86:</b> NativeWind v4 requiere plugins profundos de Babel y configuraciones de Metro con CSS global. "
                  "En las versiones mas recientes de Expo con la Nueva Arquitectura (Fabric / TurboModules), NativeWind suele presentar advertencias de bundling, "
                  "conflictos con react-native-reanimated y problemas al resolver propiedades de sombra nativas. Con StyleSheet nativo, la estabilidad es del 100%.", style_bullet),
        Paragraph("• <b>4. Rendimiento nativo sin sobrecarga de runtime:</b> <code>StyleSheet.create</code> compila los estilos en IDs numericos optimizados "
                  "que se envian al puente nativo una sola vez. No genera overhead de procesar strings de CSS en JavaScript en cada ciclo de render.", style_bullet),
    ]
    story.append(KeepTogether(q7_content))

    story.append(PageBreak())

    # =========================================================================
    # BLOQUE 2: RADIOGRAFÍA ARCHIVO POR ARCHIVO (POR QUÉ SE HIZO COMO SE HIZO)
    # =========================================================================
    story.append(Paragraph("BLOQUE 2: RADIOGRAFIA ARCHIVO POR ARCHIVO", style_h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=COLOR_PRIMARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "A continuacion se examina cada archivo del proyecto, explicando su proposito y el motivo exacto de su diseno tecnico.",
        style_body
    ))
    story.append(Spacer(1, 4))

    # --- SECCIÓN: NAVEGACIÓN ---
    story.append(Paragraph("Capa 1: Navegacion y Enrutamiento (Expo Router)", style_h2))

    story.append(make_file_card(
        "app/_layout.tsx",
        "Layout raiz (Root Layout) de toda la aplicacion.",
        "Expo Router Stack, @expo-google-fonts, useFonts asincrono",
        "Es el componente padre global. Configura el Stack de navegacion ocultando headers nativos (headerShown: false) para disenos propios. Pre-carga asincronamente las fuentes tipograficas de Google Fonts (Baloo 2 y Nunito) antes de montar la vista, evitando fallas de renderizado o parpadeos de texto."
    ))

    story.append(make_file_card(
        "app/index.tsx",
        "Punto de entrada de la aplicacion.",
        "Expo Router Redirect",
        "Contiene unicamente &lt;Redirect href='/login' /&gt;. Actua como guardia inicial de ruteo: cuando la app abre, envia de forma automatica y declarativa al usuario al flujo de inicio de sesion, impidiendo accesos desprotegidos al contenido principal."
    ))

    story.append(make_file_card(
        "app/(tabs)/_layout.tsx",
        "Navegador inferior por pestanas (Tab Navigator).",
        "Expo Router Tabs, ScreenOptions, Tokens Colors.primary / tabInactive",
        "Define la barra de navegacion inferior persistente para los usuarios autenticados. Agrupa las 5 pestanas de la app (Inicio, Mapa, Publicar, Perfil y Reporte). Consume los tokens de diseno oficiales para garantizar uniformidad estetica."
    ))

    story.append(make_file_card(
        "app/(tabs)/index.tsx",
        "Pantalla de Inicio y Feed Comunitario.",
        "FlatList, SafeAreaView, Pressable, Mock Data local MASCOTAS",
        "Es el punto de encuentro de la comunidad. Muestra un saludo, accesos directos de accion ('PUBLICAR MASCOTA' y 'VER MAPA') y una lista eficiente en FlatList que renderiza las tarjetas de mascotas con separadores calculados y ajuste de insets para no colisionar con la barra de tabs."
    ))

    story.append(make_file_card(
        "app/(tabs)/mapa.tsx",
        "Contenedor orquestador de la pantalla de Mapa (< 150 lineas).",
        "Container / Presentational Pattern, useMapState Custom Hook",
        "Originalmente era un archivo monolitico con errores. Se refactorizo bajo el patron Container: la pantalla no procesa calculos de GPS ni llamadas a Leaflet; simplemente invoca useMapState() y organiza la barra de busqueda, los chips de filtro, los controles flotantes y la tarjeta emergente."
    ))

    story.append(make_file_card(
        "app/(tabs)/publicarAlerta.tsx",
        "Formulario de alta de alerta comunitaria.",
        "Controles segmentados personalizados, ScrollView con keyboardShouldPersistTaps",
        "Permite reportar una mascota en menos de 1 minuto. Utiliza selectores segmentados tactiles para elegir Estado (Perdido, Encontrado, Visto) y Especie (Perro, Gato, Otro). Valida campos requeridos y limpia el formulario tras la confirmacion."
    ))

    story.append(make_file_card(
        "app/(tabs)/perfil.tsx",
        "Pantalla de perfil de usuario.",
        "Componente liviano listo para enlazar datos de usuario",
        "Pestana dedicada para mostrar la identidad del usuario y sus alertas historicas publicadas, estilizada con los tokens corporativos de la aplicacion."
    ))

    story.append(make_file_card(
        "app/(tabs)/reporte_error.tsx",
        "Modulo de reporte de incidentes y bugs para la comunidad.",
        "Formulario con seleccion de categoria (error tecnico vs otro)",
        "Canal de soporte que permite a vecinos y evaluadores reportar fallas tecnicas o publicaciones dudosas. Integra inputs estilizados y cabecera curvada moderna."
    ))

    story.append(make_file_card(
        "app/detalle/[id].tsx",
        "Pantalla de detalle individual de una mascota.",
        "Expo Router Dynamic Segment [id], hook useLocalSearchParams",
        "Ruta dinamica que recibe el identificador unico de una mascota (ej: /detalle/milo) para desplegar su ficha tecnica completa al tocar 'Ver Ficha Completa' en el mapa o feed."
    ))

    # --- SECCIÓN: AUTENTICACIÓN ---
    story.append(Spacer(1, 4))
    story.append(Paragraph("Capa 2: Modulo de Autenticacion (app/(auth)/)", style_h2))

    story.append(make_file_card(
        "app/(auth)/login.tsx",
        "Pantalla de Inicio de Sesion con validacion Zod y Alertas.",
        "Zod safeParse, Alert.alert, KeyboardAvoidingView, Ionicons toggle password",
        "Nucleo del flujo de entrada. Valida con loginSchema.safeParse, consulta services/authMock.ts, brinda feedback visual mediante Alert.alert nativo y maneja el teclado virtual para evitar que tape los inputs en pantallas pequenas."
    ))

    story.append(make_file_card(
        "app/(auth)/register.tsx",
        "Formulario de registro de voluntarios.",
        "Validacion de contrasenas cruzadas, ScrollView resiliente, botones sociales",
        "Solicita nombre, correo, telefono y doble contrasena. Verifica que las claves coincidan antes de procesar el registro y brinda un enlace de retorno a login."
    ))

    story.append(make_file_card(
        "app/(auth)/createAccount.tsx",
        "Alias de ruta transparente.",
        "export { default } from './register'",
        "Patron de alias de ruta. Resuelve discrepancias del equipo donde algunos navegaban a /(auth)/createAccount y otros a /(auth)/register. Re-exporta el componente en una linea, evitando duplicacion de codigo y errores 404."
    ))

    story.append(make_file_card(
        "app/(auth)/forgetPassword.tsx & forgot-password.tsx",
        "Pantallas de recuperacion de credenciales.",
        "Validacion de correo electronico con Zod, feedback con temporizador",
        "Permite recuperar contrasena ingresando el email. Cuenta con dos versiones creadas durante el sprint del equipo que demuestran la evolucion hacia un diseno limpio y validado."
    ))

    story.append(PageBreak())

    # --- SECCIÓN: MAPA Y HOOKS ---
    story.append(Paragraph("Capa 3: Modulo del Mapa Interactivo (components/map/ & hooks/)", style_h2))

    story.append(make_file_card(
        "hooks/useMapState.ts",
        "Custom Hook de logica de negocio y estado del mapa.",
        "useState, useMemo, useRef, useCallback, expo-location, geoValidation",
        "Desacopla toda la complejidad funcional del mapa: filtra mascotas con useMemo (por categoria y texto), administra la geolocalizacion GPS con expo-location, gestiona permisos denegados o desactivados de forma no bloqueante, incluye fallback a ultima posicion conocida y valida coordenadas con isValidCoordinate."
    ))

    story.append(make_file_card(
        "components/map/MapContainer.tsx",
        "Visor de mapa con Leaflet 1.9.4 corriendo en WebView.",
        "react-native-webview, forwardRef, useImperativeHandle, HTML in-memory, Event Bridge",
        "La solucion de ingenieria que elimino la pantalla negra de Google Maps. Corre Leaflet en memoria sin API Keys. Implementa comunicacion bidireccional: injectJavaScript (RN hacia WebView) y postMessage (WebView hacia RN). Expone metodos limpios de zoom y centrado mediante useImperativeHandle y muestra overlays de carga y reintento si no hay red."
    ))

    story.append(make_file_card(
        "components/map/MapControls.tsx",
        "Botones flotantes de interaccion sobre el mapa.",
        "Pressable, Ionicons, MaterialCommunityIcons, Accesibilidad Movil",
        "Proporciona botones de centrado GPS (con spinner si esta localizando) y botones de zoom (+/-). Su contenedor usa pointerEvents='box-none' para no bloquear los eventos tactiles sobre las calles del mapa."
    ))

    story.append(make_file_card(
        "components/map/MapFilterChips.tsx",
        "Filtros rapidos por categoria sobre el mapa.",
        "Pressable, MapFilterIndex (0: Todos, 1: Perdidos, 2: Encontrados)",
        "Permite alternar los pines visibles con un solo toque. Incluye puntos de color semanticos (naranja fuerte para alertas de busqueda y naranja claro para animales encontrados)."
    ))

    story.append(make_file_card(
        "components/map/MapPetCard.tsx",
        "Tarjeta flotante (Bottom Sheet) de la mascota seleccionada.",
        "Image, Badges semanticos, router.push a detalle, Boton 'Avisar que lo vi'",
        "Se abre automaticamente en la parte inferior cuando el usuario toca un pin en el mapa. Muestra la foto, tiempo transcurrido, recompensa y permite ver la ficha completa o emitir un aviso solidario al dueno."
    ))

    story.append(make_file_card(
        "components/map/MapSearchBar.tsx",
        "Barra de busqueda georreferenciada.",
        "TextInput desacoplado, boton interactivo de limpieza rapida",
        "Permite buscar por barrio, calle o nombre. Si el usuario escribe, muestra automaticamente un boton de 'X' para borrar todo el texto de una sola vez."
    ))

    # --- SECCIÓN: UI, SERVICIOS, TEMAS ---
    story.append(Spacer(1, 4))
    story.append(Paragraph("Capa 4: Componentes UI, Servicios, Temas y Validaciones", style_h2))

    story.append(make_file_card(
        "components/ui/Button.tsx",
        "Boton universal de la aplicacion (Atomo UI).",
        "TouchableOpacity, ActivityIndicator, Polimorfismo de props, Sombras cross-platform",
        "Unifica el comportamiento y estetica de los botones. Soporta loading (muestra spinner), disabled (atenua al 50%) y variantes (orange, bWhite, lightOrange). Acepta indistintamente label/onClick o title/onPress para total compatibilidad en el equipo."
    ))

    story.append(make_file_card(
        "components/ui/pet-card.tsx",
        "Tarjeta horizontal de mascota para el listado del Home.",
        "Image con URL remota, badges de estado condicionales",
        "Renderiza cada mascota en el feed principal con su foto, tipo de animal y badge condicional en verde o rojo segun este encontrada o perdida."
    ))

    story.append(make_file_card(
        "components/ui/Input.tsx & Badge.tsx & TarjetaX.tsx",
        "Archivos de estructura / stubs del backlog.",
        "Atomic Design placeholders",
        "Fueron creados al planificar el Atomic Design. Demuestran gestion de sprints: los estilos de input y badges se unificaron de forma eficiente en los componentes principales para acelerar la entrega del MVP sin sobrecargar abstracciones prematuras."
    ))

    story.append(make_file_card(
        "services/firebase.ts",
        "Configuracion e inicializacion del SDK de Firebase.",
        "Firebase v10, initializeAuth con getReactNativePersistence(AsyncStorage)",
        "Conecta la app con Firebase Auth y Firestore en la nube de Google. Configura la persistencia nativa con AsyncStorage y lee variables de entorno seguras de Expo."
    ))

    story.append(make_file_card(
        "services/authMock.ts",
        "Servicio de autenticacion simulada.",
        "USUARIOS_MOCK, simularInicioSesion insensible a mayusculas",
        "Permite iniciar sesion con credenciales de prueba prefijadas (profesor@patitas.com / 123456) para evaluar la navegacion y alertas sin depender de conexion a internet."
    ))

    story.append(make_file_card(
        "data/mapMockData.ts & data/mockData.ts",
        "Datasets simulados georreferenciados y modelos base.",
        "Coordenadas reales de Pilar, PILAR_DEFAULT_CENTER",
        "Define coordenadas GPS exactas de Pilar (latitud -34.4586, longitud -58.9142) y puntos de prueba (Milo y Luna) para visualizar pines reales sin latencia."
    ))

    story.append(make_file_card(
        "schemas/authScheama.ts",
        "Esquema de validacion de credenciales con Zod.",
        "z.object, validaciones de email y password, tipo inferido z.infer",
        "Centraliza las reglas de validacion del formulario de acceso y exporta loginFormData mediante z.infer, sincronizando la validacion de runtime con TypeScript."
    ))

    story.append(make_file_card(
        "utils/geoValidation.ts",
        "Validador matematico de coordenadas GPS.",
        "Number.isFinite, Number.isNaN, limites geograficos (-90/90, -180/180)",
        "Evita que coordenadas NaN, indefinidas o fuera de rango rompan la ejecucion de Leaflet en el WebView, garantizando solidez numerica."
    ))

    story.append(make_file_card(
        "constants/theme.ts & theme/tokens.ts",
        "Tokens de diseno y sistema de estilos centralizado.",
        "Colors, Typography (Baloo 2 / Nunito), Spacing, Radius, BottomTabInset",
        "Implementa la guia oficial de CONVENCIONES.md. Erradica colores y numeros hardcodeados en el codigo, asegurando que cualquier cambio de marca se actualice en un unico punto."
    ))

    story.append(make_file_card(
        "types/ (map.ts, Pet.ts, MapPoint.ts, User.ts)",
        "Contratos e interfaces tipadas en TypeScript.",
        "MapPet, Coordinates, PetState, MapBridgeEvent",
        "Garantizan el tipado estricto en todo el proyecto, permitiendo que 'npx tsc --noEmit' compile con 0 errores de tipado."
    ))

    story.append(PageBreak())

    # =========================================================================
    # BLOQUE 3: SIMULADOR DE PREGUNTAS Y RESPUESTAS RÁPIDAS (SPEED-RUN)
    # =========================================================================
    story.append(Paragraph("BLOQUE 3: SIMULADOR DE DEFENSA ORAL (10 PREGUNTAS CLAVE)", style_h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=COLOR_PRIMARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Estas son 10 preguntas habituales en mesas de examen de desarrollo movil. Repasa estas respuestas directas:",
        style_body
    ))
    story.append(Spacer(1, 4))

    qa_speed = [
        (
            "P1: Por que eligieron Expo Router en lugar de React Navigation clasico?",
            "<b>R:</b> Expo Router utiliza enrutamiento basado en archivos (file-based routing), como Next.js en web. "
            "Elimina la necesidad de declarar manualmente arboles gigantes de navegacion en un solo archivo. "
            "Las carpetas con parentesis como <code>(auth)</code> o <code>(tabs)</code> agrupan rutas sin modificar la URL, "
            "y los archivos entre corchetes como <code>[id].tsx</code> gestionan parametros dinamicos de forma nativa y tipada."
        ),
        (
            "P2: Si usaron WebView para el mapa, no es mas lento que un componente nativo?",
            "<b>R:</b> Al contrario, fue una decision de ingenieria muy eficiente. El WebView ejecuta un template HTML ultra ligero cargado en memoria local, "
            "sin descargar assets pesados de internet salvo las imagenes de las teselas de OpenStreetMap. "
            "Nos permitio garantizar <b>100% de visibilidad en cualquier celular y emulador sin pagar licencias de Google Cloud ni depender de Google Play Services</b>."
        ),
        (
            "P3: Como se comunican React Native y el WebView del mapa?",
            "<b>R:</b> Mediante un <b>puente bidireccional de eventos (Event Bridge)</b>: "
            "De React Native hacia el mapa enviamos datos con <code>webViewRef.current.injectJavaScript()</code> invocando funciones del objeto <code>window.mapBridge</code>. "
            "Del mapa hacia React Native se envian eventos llamando a <code>window.ReactNativeWebView.postMessage()</code>, lo cual dispara la funcion <code>onMessage</code> en React Native con eventos tipados como `MARKER_CLICK` o `MAP_READY`."
        ),
        (
            "P4: Por que en useMapState se usan useMemo y useCallback?",
            "<b>R:</b> Para optimizar el rendimiento y evitar renders redundantes en dispositivos moviles. Con <code>useMemo</code> recalculamos la lista filtrada de mascotas "
            "unicamente cuando cambian el texto de busqueda o la categoria elegida. Con <code>useCallback</code> memorizamos las funciones de localizacion y zoom "
            "para no recrear instancias de funciones en cada ciclo de render."
        ),
        (
            "P5: Que sucede si el usuario rechaza los permisos de GPS?",
            "<b>R:</b> En <code>hooks/useMapState.ts</code> verificamos primero si la ubicacion esta encendida en el dispositivo con <code>hasServicesEnabledAsync()</code> "
            "y luego solicitamos permisos con <code>getForegroundPermissionsAsync()</code>. Si el permiso es rechazado de forma permanente (<code>!canAskAgain</code>), "
            "la app no se cierra ni se congela: mostramos un <code>Alert.alert</code> informativo explicando amablemente como habilitarlo desde ajustes, "
            "y el mapa permanece operativo centrado en las coordenadas por defecto de Pilar."
        ),
        (
            "P6: Que es Zod y que ventaja tiene sobre validar con if/else?",
            "<b>R:</b> Zod es una libreria de validacion declarativa de esquemas. Con simples <code>if/else</code> el codigo se dispersa y es dificil de mantener. "
            "Zod centraliza todas las reglas en un solo objeto (email obligatorio, formato valido, clave de minimo 6 caracteres). "
            "Ademas, mediante <code>z.infer</code> obtenemos automaticamente el tipo estatico de TypeScript, asegurando coherencia total entre el tiempo de ejecucion y la compilacion."
        ),
        (
            "P7: Por que tienen archivos como createAccount.tsx que solo tienen una linea?",
            "<b>R:</b> Es una tecnica de <b>alias y retrocompatibilidad</b>. Durante el trabajo colaborativo, un desarrollador enlazaba a <code>register</code> y otro a <code>createAccount</code>. "
            "Hacer <code>export { default } from './register';</code> soluciona el problema sin duplicar lineas de codigo y garantiza que ninguna ruta quede rota."
        ),
        (
            "P8: Por que crearon constants/theme.ts en vez de escribir los colores directamente en el StyleSheet?",
            "<b>R:</b> Para implementar un <b>Design System con Design Tokens</b> y cumplir con el estandar acordado en <code>CONVENCIONES.md</code>. "
            "Evita números mágicos y colores hexadecimales dispersos. Si la identidad visual de la app cambia, se modifica en un solo archivo y toda la aplicacion "
            "se actualiza de forma inmediata y consistente."
        ),
        (
            "P9: Por que se utilizo KeyboardAvoidingView en las pantallas con formularios?",
            "<b>R:</b> En dispositivos moviles, cuando se abre el teclado tactil en pantalla, suele tapar los campos de entrada y el boton de envio. "
            "<code>KeyboardAvoidingView</code> ajusta dinamicamente la altura o el espaciado para que los inputs sigan visibles mientras el usuario escribe."
        ),
        (
            "P10: Cual es la diferencia entre simular autenticacion con authMock y usar Firebase Auth?",
            "<b>R:</b> <code>services/firebase.ts</code> contiene la conexion real con los servidores en la nube de Firebase, con persistencia nativa en <code>AsyncStorage</code>. "
            "<code>services/authMock.ts</code> es una capa de simulacion rapida en memoria con usuarios fijos (<code>profesor@patitas.com</code>). "
            "Tener ambas capas demuestra una arquitectura madura: permite pruebas y defensas academicas 100% garantizadas sin riesgo de caidas de red del aula o limites de cuota de Firebase."
        ),
        (
            "P11: Por que no usaron Tailwind / NativeWind si esta en package.json y en el README?",
            "<b>R:</b> Se instalo en el setup inicial, pero decidimos priorizar <b>StyleSheet.create</b> con Design Tokens (<code>constants/theme.ts</code>) por 3 razones tecnicas: "
            "1) Cumplir la regla 5 de <code>CONVENCIONES.md</code> (estilos al final para un JSX limpio), "
            "2) Garantizar tipado estricto al 100% con TypeScript en colores y espaciados (evitando errores silenciosos de tipeo en strings de clases), y "
            "3) Evitar incompatibilidades de bundling de NativeWind v4 con Expo SDK 57 y la Nueva Arquitectura de React Native 0.86."
        ),
    ]

    for q, a in qa_speed:
        item = [
            Paragraph(q, style_qa_q),
            Paragraph(a, style_qa_a),
            Spacer(1, 2)
        ]
        story.append(KeepTogether(item))

    # Construcción final del PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF generado exitosamente en: {output_filename}")


if __name__ == "__main__":
    output = "Guia_Defensa_Parcial_Patitas_Encontradas.pdf"
    create_study_guide_pdf(output)
