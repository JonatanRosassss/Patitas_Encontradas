# -*- coding: utf-8 -*-
"""
Generador del PDF de Planificacion del Sprint 3 - Patitas Encontradas
Genera un documento profesional con ReportLab con la organizacion de 7 miembros
en 3 celulas (2+2+3) y la asignacion de 10 tareas tecnicas.
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

# --- PALETA DE COLORES OFICIAL PATITAS ENCONTRADAS ---
COLOR_PRIMARY = colors.HexColor("#FF8A00")       # Naranja Principal
COLOR_PRIMARY_DARK = colors.HexColor("#D47000")  # Naranja Oscuro
COLOR_SECONDARY = colors.HexColor("#5A3A1F")     # Marron Texto
COLOR_ACCENT = colors.HexColor("#FFE7D2")        # Durazno Claro
COLOR_BG_CARD = colors.HexColor("#FAF8F5")       # Fondo Tarjetas
COLOR_WHITE = colors.HexColor("#FFFFFF")         # Blanco
COLOR_BORDER = colors.HexColor("#E8DFD8")        # Borde Suave
COLOR_TEXT = colors.HexColor("#2B2D42")          # Texto Principal
COLOR_TEXT_MUTED = colors.HexColor("#7D8597")    # Texto Secundario

# Colores de Celulas
COLOR_TEAM1 = colors.HexColor("#1976D2")         # Azul Auth
COLOR_TEAM1_BG = colors.HexColor("#E3F2FD")
COLOR_TEAM2 = colors.HexColor("#2E7D32")         # Verde Data/CRUD
COLOR_TEAM2_BG = colors.HexColor("#E8F5E9")
COLOR_TEAM3 = colors.HexColor("#7B1FA2")         # Purpura UX/Docs
COLOR_TEAM3_BG = colors.HexColor("#F3E5F5")


class NumberedCanvas(canvas.Canvas):
    """Canvas de dos pasadas para pie de pagina con paginacion dinamica."""
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
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(COLOR_TEXT_MUTED)

        # Encabezado superior
        self.drawString(54, 752, "Patitas Encontradas | Planificacion Agil - Sprint 3")
        self.setStrokeColor(COLOR_BORDER)
        self.setLineWidth(0.5)
        self.line(54, 745, 558, 745)

        # Pie de pagina inferior
        self.line(54, 45, 558, 45)
        self.drawString(54, 32, "Universidad Nacional de Pilar (UNP) | Desarrollo de Aplicaciones Moviles")
        page_text = f"Pagina {self._pageNumber} de {num_pages}"
        self.drawRightString(558, 32, page_text)

        self.restoreState()


def create_sprint3_pdf(output_filename="Sprint_3_Planificacion_Equipos_Patitas_Encontradas.pdf"):
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54,
    )

    styles = getSampleStyleSheet()

    # --- ESTILOS TIPOGRAFICOS ---
    style_cover_title = ParagraphStyle(
        "CoverTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=COLOR_PRIMARY_DARK,
        alignment=0,
        spaceAfter=4,
    )

    style_cover_subtitle = ParagraphStyle(
        "CoverSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=15,
        textColor=COLOR_SECONDARY,
        spaceAfter=10,
    )

    style_h1 = ParagraphStyle(
        "Heading1_Custom",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=17,
        textColor=COLOR_PRIMARY_DARK,
        spaceBefore=12,
        spaceAfter=5,
        keepWithNext=True,
    )

    style_h2 = ParagraphStyle(
        "Heading2_Custom",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=14,
        textColor=COLOR_SECONDARY,
        spaceBefore=9,
        spaceAfter=4,
        keepWithNext=True,
    )

    style_body = ParagraphStyle(
        "Body_Custom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=COLOR_TEXT,
        spaceAfter=4,
    )

    style_body_bold = ParagraphStyle(
        "BodyBold_Custom",
        parent=style_body,
        fontName="Helvetica-Bold",
    )

    style_task_title = ParagraphStyle(
        "TaskTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.2,
        leading=12.5,
        textColor=COLOR_TEXT,
    )

    style_task_desc = ParagraphStyle(
        "TaskDesc",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.3,
        leading=11.8,
        textColor=COLOR_TEXT,
    )

    style_callout = ParagraphStyle(
        "CalloutText",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.3,
        leading=11.8,
        textColor=COLOR_SECONDARY,
    )

    style_th = ParagraphStyle(
        "TableHead",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.2,
        leading=11,
        textColor=COLOR_WHITE,
        alignment=1,
    )

    style_td = ParagraphStyle(
        "TableData",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.8,
        leading=10.8,
        textColor=COLOR_TEXT,
    )

    story = []

    # =========================================================================
    # ENCABEZADO Y FICHA TECNICA DEL SPRINT
    # =========================================================================
    story.append(Spacer(1, 5))
    story.append(Paragraph("PLANIFICACION AGIL Y ASIGNACION DE ROLES", style_cover_title))
    story.append(Paragraph("TERCER SPRINT | PROYECTO PATITAS ENCONTRADAS", style_cover_subtitle))

    # Tarjeta de Datos Clave
    meta_text = (
        "<b>Catedra:</b> Desarrollo de Aplicaciones Moviles (UNP 2026)<br/>"
        "<b>Equipo de Desarrollo:</b> 7 integrantes | Francisco, Rodrigo, Sol, Jona, Maxi, Yerik, Santino<br/>"
        "<b>Estructura Operativa:</b> 3 Celulas de Trabajo en Parejas y Trio (2 + 2 + 3)<br/>"
        "<b>Alcance del Sprint:</b> 10 tareas tecnicas (Backlog del Tercer Sprint + Diseno en Padlet)"
    )
    t_meta = Table([[Paragraph(meta_text, style_body)]], colWidths=[504])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_ACCENT),
        ('BOX', (0,0), (-1,-1), 1, COLOR_PRIMARY),
        ('PADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # =========================================================================
    # JUSTIFICACION DE LA DIVISION DE EQUIPOS (2 + 2 + 3)
    # =========================================================================
    story.append(Paragraph("1. Estrategia de Division de Celulas", style_h1))
    intro_p = (
        "Para organizar a los 7 desarrolladores minimizando colisiones en Git y garantizando "
        "cohesion funcional, se adopta el esquema de <b>3 celulas autonomas: 2 parejas y 1 trio (2 + 2 + 3)</b>. "
        "Cada celula asume la propiedad de un modulo critico de la aplicacion."
    )
    story.append(Paragraph(intro_p, style_body))
    story.append(Spacer(1, 4))

    # Tabla resumen de Celulas
    team_summary_data = [
        [
            Paragraph("<b>Celula / Equipo</b>", style_th),
            Paragraph("<b>Integrantes</b>", style_th),
            Paragraph("<b>Rol Asignado</b>", style_th),
            Paragraph("<b>Dominio Tecnico</b>", style_th),
        ],
        [
            Paragraph("<b>Equipo 1 (2 pers.)</b>", style_td),
            Paragraph("Jona<br/>Francisco", style_td),
            Paragraph("Auth & State Leads", style_td),
            Paragraph("Sesion global, Tokens, Auth, Perfil y Permisos por autor", style_td),
        ],
        [
            Paragraph("<b>Equipo 2 (2 pers.)</b>", style_td),
            Paragraph("Maxi<br/>Rodrigo", style_td),
            Paragraph("Core Data & Backend Devs", style_td),
            Paragraph("Home con base de datos, Detalle de mascota, WhatsApp y CRUD", style_td),
        ],
        [
            Paragraph("<b>Equipo 3 (3 pers.)</b>", style_td),
            Paragraph("Sol<br/>Yerik<br/>Santino", style_td),
            Paragraph("UX/UI & Doc Leads", style_td),
            Paragraph("Bosquejos en Padlet, Pantalla de Bienvenida y Documentacion (5 al 9)", style_td),
        ],
    ]
    t_teams = Table(team_summary_data, colWidths=[95, 85, 110, 214])
    t_teams.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_SECONDARY),
        ('GRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_teams)
    story.append(Spacer(1, 10))

    # =========================================================================
    # DETALLE DE TAREAS POR CELULA
    # =========================================================================
    story.append(Paragraph("2. Asignacion Detallada de Tareas por Celula", style_h1))

    def make_task_card(task_num, title, team_label, members, branch, objective, dod, team_color):
        header_text = (
            f"<b>Tarea #{task_num}: {title}</b><br/>"
            f"<font color='{team_color.hexval()}'><b>{team_label}</b></font> | "
            f"<b>Responsables:</b> {members} | <b>Rama:</b> <code>{branch}</code>"
        )
        body_text = (
            f"<b>Objetivo Tecnico:</b> {objective}<br/>"
            f"<b>Criterio de Aceptacion (DoD):</b> {dod}"
        )
        header_p = Paragraph(header_text, style_task_title)
        body_p = Paragraph(body_text, style_task_desc)

        t = Table([[header_p], [body_p]], colWidths=[504])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), COLOR_BG_CARD),
            ('BACKGROUND', (0,1), (-1,1), COLOR_WHITE),
            ('BOX', (0,0), (-1,-1), 0.75, COLOR_BORDER),
            ('LINELEFT', (0,0), (0,-1), 3, team_color),
            ('LINEBELOW', (0,0), (-1,0), 0.5, COLOR_BORDER),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 7),
            ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ]))
        return KeepTogether([t, Spacer(1, 5)])

    # --- EQUIPO 1 ---
    story.append(Paragraph("<b>CELULA 1: AUTENTICACION, SESION Y PERFIL (JONA & FRANCISCO)</b>", style_h2))

    story.append(make_task_card(
        1, "Pushear el LOGIN y variable de sesion",
        "Equipo 1 (Pareja)", "Jona & Francisco", "feat/auth-login-session",
        "Subir al repositorio el formulario de Login integrado con el almacenamiento local seguro (AsyncStorage/SecureStore) para persistir el token y estado de sesion del usuario.",
        "El usuario inicia sesion correctamente, los datos se almacenan en memoria/storage persistente y la sesion no se pierde al reiniciar la aplicacion.",
        COLOR_TEAM1
    ))

    story.append(make_task_card(
        2, "Obtener usuario mediante AUTH",
        "Equipo 1 (Pareja)", "Jona & Francisco", "feat/auth-user-context",
        "Implementar hook o funcion global de autenticacion que exponga los datos del usuario logueado (ID, email, nombre) a cualquier vista que lo requiera.",
        "Se puede acceder al perfil y a la identificacion unica del usuario logueado en tiempo de ejecucion sin repetir peticiones innecesarias.",
        COLOR_TEAM1
    ))

    story.append(make_task_card(
        3, "Boton de eliminar publicacion si es el autor",
        "Equipo 1 (Pareja)", "Jona & Francisco", "feat/delete-post-author-check",
        "Condicionar el renderizado y accion del boton de eliminar reporte: comparar el ID del usuario en sesion con el authorId de la publicacion.",
        "Si el usuario actual es el creador de la publicacion, el boton de eliminar es visible y funcional. Si no lo es, el boton permanece oculto o deshabilitado.",
        COLOR_TEAM1
    ))

    story.append(make_task_card(
        4, "Listar publicaciones del usuario en Perfil.tsx y listar puntos en el mapa mediante listarAlertaParaMapa",
        "Equipo 1 (Pareja)", "Jona & Francisco", "feat/profile-user-posts-map",
        "Conectar Perfil.tsx con la BD para mostrar las publicaciones del usuario activo, y vincular la funcion listarAlertaParaMapa para georreferenciar las alertas activas.",
        "La pantalla Perfil muestra el historial propio del usuario y el mapa renderiza los marcadores interactivos de alertas en base a datos reales.",
        COLOR_TEAM1
    ))

    story.append(Spacer(1, 4))

    # --- EQUIPO 2 ---
    story.append(Paragraph("<b>CELULA 2: CORE FEED, DETALLE Y CONEXION A BASE DE DATOS (MAXI & RODRIGO)</b>", style_h2))

    story.append(make_task_card(
        5, "Realizar el HOME mediante la conexion a BD",
        "Equipo 2 (Pareja)", "Maxi & Rodrigo", "feat/home-feed-database",
        "Conectar la pantalla principal (Home) al servicio de base de datos para cargar dinamicamente la lista de mascotas perdidas y encontradas con sus fotos y estado.",
        "El Home consume la BD, implementa scroll fluido, estados de carga (skeletons/spinner) y maneja listas vacias o fallas de red con elegancia.",
        COLOR_TEAM2
    ))

    story.append(make_task_card(
        6, "Mostrar detalle de la mascota mediante BD y redirigir a WhatsApp",
        "Equipo 2 (Pareja)", "Maxi & Rodrigo", "feat/pet-detail-whatsapp",
        "Disenar y conectar la pantalla de Detalle con la BD (datos completos de la mascota) e incorporar boton de contacto que abra WhatsApp con mensaje precargado.",
        "Al presionar Contactar, se abre la aplicacion de WhatsApp (Linking API) con el numero del publicador y un mensaje con el nombre y referencia de la mascota.",
        COLOR_TEAM2
    ))

    story.append(make_task_card(
        7, "Comprobar que funciona el CRUD",
        "Equipo 2 (Pareja)", "Maxi & Rodrigo", "test/crud-integration-verification",
        "Ejecutar pruebas integrales del ciclo completo de publicaciones: Creacion (Create), Lectura (Read en Home/Detalle/Perfil), Actualizacion (Update) y Eliminacion (Delete).",
        "Matriz de pruebas CRUD ejecutada con exito, registrando evidencia de que la base de datos responde correctamente y no quedan registros huerfanos.",
        COLOR_TEAM2
    ))

    story.append(Spacer(1, 4))

    # --- EQUIPO 3 ---
    story.append(Paragraph("<b>CELULA 3: UX/UI, ONBOARDING, BOSQUEJOS Y DOCUMENTACION (SOL, YERIK & SANTINO)</b>", style_h2))

    story.append(make_task_card(
        8, "Hacer bosquejos en Padlet",
        "Equipo 3 (Trio)", "Sol, Yerik & Santino", "design/padlet-wireframes",
        "Elaborar en Padlet los bosquejos visuales, arquitectura de informacion y wireframes de las pantallas de Bienvenida, Detalle y Perfil para alinear el diseno del equipo.",
        "Tablero de Padlet completo y compartido con el equipo con el flujo visual de usuario y especificacion de componentes.",
        COLOR_TEAM3
    ))

    story.append(make_task_card(
        9, "Pantalla de Bienvenida -> INFO DE LA APP",
        "Equipo 3 (Trio)", "Sol, Yerik & Santino", "feat/welcome-info-screen",
        "Crear la pantalla inicial de Bienvenida/Onboarding explicando la propuesta de valor y funcionamiento de Patitas Encontradas con navegacion amigable.",
        "Pantalla maquetada conforme a los bosquejos de Padlet, con diseno responsivo, botones claros de entrada ('Comenzar' / 'Iniciar Sesion').",
        COLOR_TEAM3
    ))

    story.append(make_task_card(
        10, "Terminar la mitad de la documentacion del incremento 2 (5 al 9)",
        "Equipo 3 (Trio)", "Sol (SB), Yerik & Santino", "docs/incremento-2-part2",
        "Redactar y consolidar formalmente las secciones 5 al 9 del documento de entrega academica del Incremento 2 (diagramas, casos de uso, justificaciones de diseno).",
        "Documento del Incremento 2 actualizado y validado con todos los requerimientos solicitados por la catedra.",
        COLOR_TEAM3
    ))

    story.append(Spacer(1, 10))

    # =========================================================================
    # MATRIZ RACI / RESUMEN
    # =========================================================================
    story.append(Paragraph("3. Matriz de Responsabilidades y Dependencias", style_h1))

    raci_data = [
        [
            Paragraph("<b>Tarea</b>", style_th),
            Paragraph("<b>Celula</b>", style_th),
            Paragraph("<b>Responsables</b>", style_th),
            Paragraph("<b>Dependencia Clave</b>", style_th),
        ],
        [
            Paragraph("1. Pushear LOGIN y sesion", style_td),
            Paragraph("Equipo 1", style_td),
            Paragraph("Jona, Francisco", style_td),
            Paragraph("Ninguna (Base inicial)", style_td),
        ],
        [
            Paragraph("2. Obtener usuario AUTH", style_td),
            Paragraph("Equipo 1", style_td),
            Paragraph("Jona, Francisco", style_td),
            Paragraph("Requiere Tarea 1 (Login)", style_td),
        ],
        [
            Paragraph("3. Boton eliminar si es autor", style_td),
            Paragraph("Equipo 1", style_td),
            Paragraph("Jona, Francisco", style_td),
            Paragraph("Requiere Tarea 2 (AUTH)", style_td),
        ],
        [
            Paragraph("4. Perfil.tsx y AlertaParaMapa", style_td),
            Paragraph("Equipo 1", style_td),
            Paragraph("Jona, Francisco", style_td),
            Paragraph("Requiere Tarea 2 y BD activa", style_td),
        ],
        [
            Paragraph("5. Home con conexion a BD", style_td),
            Paragraph("Equipo 2", style_td),
            Paragraph("Maxi, Rodrigo", style_td),
            Paragraph("Ninguna (Consume coleccion posts)", style_td),
        ],
        [
            Paragraph("6. Detalle mascota + WhatsApp", style_td),
            Paragraph("Equipo 2", style_td),
            Paragraph("Maxi, Rodrigo", style_td),
            Paragraph("Requiere ID de mascota de Tarea 5", style_td),
        ],
        [
            Paragraph("7. Comprobar funciona CRUD", style_td),
            Paragraph("Equipo 2", style_td),
            Paragraph("Maxi, Rodrigo", style_td),
            Paragraph("Se valida con Tareas 3, 4, 5 y 6", style_td),
        ],
        [
            Paragraph("8. Bosquejos en Padlet", style_td),
            Paragraph("Equipo 3", style_td),
            Paragraph("Sol, Yerik, Santino", style_td),
            Paragraph("Prioridad Dia 1 (Desbloquea UI)", style_td),
        ],
        [
            Paragraph("9. Pantalla de Bienvenida", style_td),
            Paragraph("Equipo 3", style_td),
            Paragraph("Sol, Yerik, Santino", style_td),
            Paragraph("Se basa en Tarea 8 (Padlet)", style_td),
        ],
        [
            Paragraph("10. Docs Incremento 2 (5 al 9)", style_td),
            Paragraph("Equipo 3", style_td),
            Paragraph("Sol (SB), Yerik, Santino", style_td),
            Paragraph("En paralelo durante el sprint", style_td),
        ],
    ]
    t_raci = Table(raci_data, colWidths=[140, 60, 110, 194])
    t_raci.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_PRIMARY_DARK),
        ('GRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_raci)
    story.append(Spacer(1, 10))

    # =========================================================================
    # RECOMENDACIONES DE SINCRONIZACION Y GIT WORKFLOW
    # =========================================================================
    story.append(Paragraph("4. Recomendaciones de Coordinacion del Sprint", style_h1))

    workflow_box_text = (
        "<b>1. Inicio Inmediato (Dia 1):</b> El <b>Equipo 3</b> debe publicar los bosquejos en Padlet en las primeras 24hs "
        "para que el <b>Equipo 2</b> y el <b>Equipo 1</b> respeten la composicion visual en Home, Detalle y Bienvenida.<br/>"
        "<b>2. Politica de Ramas en Git:</b> Cada celula trabaja en su propia rama tematica (<code>feat/...</code>). "
        "Ningun integrante commitea directamente a <code>main</code> o <code>develop</code> sin Pull Request revisado por su companero.<br/>"
        "<b>3. Hito de Integracion Cruzada:</b> La validacion de autor para eliminar publicacion (Equipo 1) debe probarse "
        "directamente sobre las vistas del Home/Detalle que desarrolla el Equipo 2.<br/>"
        "<b>4. Cierre del Sprint:</b> Maxi y Rodrigo (Equipo 2) lideran la ejecucion de la prueba general del CRUD, "
        "mientras Sol, Yerik y Santino incorporan los resultados en la documentacion final del Incremento."
    )

    t_box = Table([[Paragraph(workflow_box_text, style_callout)]], colWidths=[504])
    t_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_BG_CARD),
        ('BOX', (0,0), (-1,-1), 1, COLOR_PRIMARY),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_box)

    # Construccion del documento
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Documento generado exitosamente en: {output_filename}")


if __name__ == "__main__":
    out_file = "Sprint_3_Planificacion_Equipos_Patitas_Encontradas.pdf"
    if len(sys.argv) > 1:
        out_file = sys.argv[1]
    create_sprint3_pdf(out_file)
