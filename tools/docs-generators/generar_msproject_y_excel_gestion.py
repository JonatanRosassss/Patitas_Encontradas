# -*- coding: utf-8 -*-
"""
generar_msproject_y_excel_gestion.py
====================================
Generador integral y perfeccionado de entregables de gestión, planificación y aseguramiento de calidad
para el proyecto 'Patitas Encontradas' (Universidad Nacional de Pilar / Cátedra Testing y Calidad).

Inspirado 1:1 en la estructura, jerarquía y asignaciones de 'Semaforo-VF1.xml' (Prof. Mg. Pedro Brest):
1. Patitas_Encontradas_Plan_Gestion_MSProject.xml:
   - Estructura jerárquica de 12 Fases y 64 actividades de ingeniería de software.
   - Nombres limpios sin prefijos artificiales.
   - Asignaciones explícitas de recursos (<Assignments>) para que Microsoft Project renderice
     los nombres y porcentajes de los responsables al lado de cada barra del Gantt.
   - Semáforos en Text1 ('V', 'A', 'R', 'T', 'RE', 'AD') y atributos extendidos Number1..Number6.
2. Patitas_Encontradas_Tablero_Control_y_Gestion_Integral.xlsx:
   - Tablero Maestro en Excel con 7 hojas de cálculo estilizadas y 6 diagramas en alta resolución embebidos.
"""

import os
import shutil
import datetime
import xml.etree.ElementTree as ET
from xml.dom import minidom
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.drawing.image import Image as OpenpyxlImage

# -------------------------------------------------------------
# RUTAS Y CONSTANTES
# -------------------------------------------------------------
BASE_DIR = os.path.abspath(r"c:\UNI PILAR\AppsMoviles\Patitas_Encontradas")
DOCS_INFORMES = os.path.join(BASE_DIR, "docs", "informes")
DIAGRAMAS_DIR = os.path.join(BASE_DIR, "docs", "diagramas")
DEST_PRESENTACIONES = r"C:\UNI PILAR\Testing_y_calidad\Docs_Presentaciones"

OUTPUT_XML_NAME = "Patitas_Encontradas_Plan_Gestion_MSProject.xml"
OUTPUT_XLSX_NAME = "Patitas_Encontradas_Tablero_Control_y_Gestion_Integral.xlsx"

COLOR_NAVY_DARK = "1B365D"
COLOR_ORANGE_BRAND = "FF8A00"
COLOR_GRAY_LIGHT = "F4F6F9"
COLOR_GRAY_BORDER = "D1D5DB"
COLOR_WHITE = "FFFFFF"
COLOR_TEXT_MAIN = "1F2937"
COLOR_TEXT_MUTED = "4B5563"

FILL_VERDE = PatternFill(start_color="D4EDDA", end_color="D4EDDA", fill_type="solid")
FONT_VERDE = Font(name="Segoe UI", size=10, bold=True, color="155724")

FILL_AMARILLO = PatternFill(start_color="FFF3CD", end_color="FFF3CD", fill_type="solid")
FONT_AMARILLO = Font(name="Segoe UI", size=10, bold=True, color="856404")

FILL_ROJO = PatternFill(start_color="F8D7DA", end_color="F8D7DA", fill_type="solid")
FONT_ROJO = Font(name="Segoe UI", size=10, bold=True, color="721C24")

FILL_AZUL = PatternFill(start_color="CCE5FF", end_color="CCE5FF", fill_type="solid")
FONT_AZUL = Font(name="Segoe UI", size=10, bold=True, color="004085")

FONT_TITLE = Font(name="Segoe UI", size=15, bold=True, color=COLOR_WHITE)
FONT_SUBTITLE = Font(name="Segoe UI", size=11, bold=True, color=COLOR_ORANGE_BRAND)
FONT_SECTION = Font(name="Segoe UI", size=12, bold=True, color=COLOR_NAVY_DARK)
FONT_TH = Font(name="Segoe UI", size=10, bold=True, color=COLOR_WHITE)
FONT_TBODY = Font(name="Segoe UI", size=9, color=COLOR_TEXT_MAIN)
FONT_TBODY_BOLD = Font(name="Segoe UI", size=9, bold=True, color=COLOR_TEXT_MAIN)
FONT_KPI_VAL = Font(name="Segoe UI", size=16, bold=True, color=COLOR_NAVY_DARK)
FONT_KPI_LBL = Font(name="Segoe UI", size=9, bold=True, color=COLOR_TEXT_MUTED)

FILL_NAVY = PatternFill(start_color=COLOR_NAVY_DARK, end_color=COLOR_NAVY_DARK, fill_type="solid")
FILL_ORANGE = PatternFill(start_color=COLOR_ORANGE_BRAND, end_color=COLOR_ORANGE_BRAND, fill_type="solid")
FILL_ZEBRA = PatternFill(start_color="F9FAFB", end_color="F9FAFB", fill_type="solid")
FILL_CARD_BG = PatternFill(start_color="EEF2F6", end_color="EEF2F6", fill_type="solid")

BORDER_THIN = Border(
    left=Side(style='thin', color=COLOR_GRAY_BORDER),
    right=Side(style='thin', color=COLOR_GRAY_BORDER),
    top=Side(style='thin', color=COLOR_GRAY_BORDER),
    bottom=Side(style='thin', color=COLOR_GRAY_BORDER)
)
BORDER_HEADER = Border(
    left=Side(style='thin', color="374151"),
    right=Side(style='thin', color="374151"),
    top=Side(style='medium', color=COLOR_NAVY_DARK),
    bottom=Side(style='medium', color=COLOR_NAVY_DARK)
)

ALIGN_CENTER = Alignment(horizontal='center', vertical='center', wrap_text=True)
ALIGN_LEFT = Alignment(horizontal='left', vertical='center', wrap_text=True)
ALIGN_RIGHT = Alignment(horizontal='right', vertical='center')

# -------------------------------------------------------------
# RECURSOS HUMANOS AUDITADOS DEL PROYECTO
# -------------------------------------------------------------
RECURSOS = [
    {"uid": 1, "nombre": "Jonatan Rosas", "iniciales": "JR", "rol": "Product Owner / Arquitectura Lead", "grupo": "Célula 1", "rate": 8500},
    {"uid": 2, "nombre": "Sol Careaga", "iniciales": "SC", "rol": "Scrum Master / UX & Documentación Lead", "grupo": "Célula 3", "rate": 8500},
    {"uid": 3, "nombre": "Rodrigo Paz", "iniciales": "RP", "rol": "QA Lead / Core Data & Detalle Dev", "grupo": "Célula 2", "rate": 8500},
    {"uid": 4, "nombre": "Maximiliano Duarte", "iniciales": "MD", "rol": "Core Data / Publicar & Filtros Dev", "grupo": "Célula 2", "rate": 8500},
    {"uid": 5, "nombre": "Francisco González", "iniciales": "FG", "rol": "Auth / Registro & Perfil Dev", "grupo": "Célula 1", "rate": 8500},
    {"uid": 6, "nombre": "Yerik Ramos", "iniciales": "YR", "rol": "UX-UI / Home Feed, Ajustes & Share Dev", "grupo": "Célula 3", "rate": 8500},
    {"uid": 7, "nombre": "Martina Guenin", "iniciales": "MG", "rol": "Cartografía v1 / Wireframes & UX Dev", "grupo": "Célula 3", "rate": 8500},
    {"uid": 8, "nombre": "Pedro Brest", "iniciales": "PB", "rol": "Profesor Cátedra Testing y Calidad", "grupo": "Docente / Evaluador", "rate": 0}
]

# -------------------------------------------------------------
# DEFINICIÓN JERÁRQUICA DETALLADA (12 FASES, 64 TAREAS HOJA)
# -------------------------------------------------------------
TAREAS_MASTER = [
    # Tarea Raíz
    {
        "uid": 1, "id": 1, "wbs": "1", "lvl": 1, "summary": True, "crit": True,
        "name": "Patitas Encontradas — Red Comunitaria de Mascotas en Pilar",
        "dur": 45, "start": "2026-08-24T08:00:00", "finish": "2026-10-26T17:00:00",
        "preds": [], "assignees": [], "sem": "V"
    },
    
    # FASE 1: 1.1 Reunión inicial y Organización del Equipo
    {
        "uid": 2, "id": 2, "wbs": "1.1", "lvl": 2, "summary": True, "crit": True,
        "name": "Reunión inicial y Organización del Equipo",
        "dur": 2, "start": "2026-08-24T08:00:00", "finish": "2026-08-25T17:00:00",
        "preds": [], "assignees": [], "sem": "T"
    },
    {
        "uid": 3, "id": 3, "wbs": "1.1.1", "lvl": 3, "summary": False, "crit": True,
        "name": "División del equipo y asignación de roles (PO, SM, Células)",
        "dur": 1, "start": "2026-08-24T08:00:00", "finish": "2026-08-24T17:00:00",
        "preds": [], "assignees": [(1, 0.5), (2, 0.5)], "sem": "T"
    },
    {
        "uid": 4, "id": 4, "wbs": "1.1.2", "lvl": 3, "summary": False, "crit": True,
        "name": "Kickoff del proyecto y definición del alcance sociocomunitario",
        "dur": 1, "start": "2026-08-24T08:00:00", "finish": "2026-08-24T17:00:00",
        "preds": [], "assignees": [(8, 0.1), (1, 0.15), (2, 0.15), (3, 0.15), (4, 0.15), (5, 0.15), (6, 0.15)], "sem": "T"
    },
    {
        "uid": 5, "id": 5, "wbs": "1.1.3", "lvl": 3, "summary": False, "crit": True,
        "name": "Definir estándares formales, TypeScript estricto y stack Expo 57",
        "dur": 1, "start": "2026-08-25T08:00:00", "finish": "2026-08-25T17:00:00",
        "preds": [3], "assignees": [(1, 0.5), (4, 0.5)], "sem": "T"
    },

    # FASE 2: 1.2 Diagnóstico Territorial y Análisis Funcional
    {
        "uid": 6, "id": 6, "wbs": "1.2", "lvl": 2, "summary": True, "crit": True,
        "name": "Diagnóstico Territorial y Análisis Funcional",
        "dur": 13, "start": "2026-08-25T08:00:00", "finish": "2026-09-10T17:00:00",
        "preds": [2], "assignees": [], "sem": "V"
    },
    {
        "uid": 7, "id": 7, "wbs": "1.2.1", "lvl": 3, "summary": False, "crit": True,
        "name": "Relevamiento territorial y mapeo colectivo en Pilar (5 Meets)",
        "dur": 4, "start": "2026-08-25T08:00:00", "finish": "2026-08-28T17:00:00",
        "preds": [4], "assignees": [(2, 0.5), (7, 0.5)], "sem": "V"
    },
    {
        "uid": 8, "id": 8, "wbs": "1.2.2", "lvl": 3, "summary": False, "crit": True,
        "name": "Elaboración del árbol de problemas y matriz de actores",
        "dur": 2, "start": "2026-08-31T08:00:00", "finish": "2026-09-01T17:00:00",
        "preds": [7], "assignees": [(2, 0.5), (1, 0.5)], "sem": "V"
    },
    {
        "uid": 9, "id": 9, "wbs": "1.2.3", "lvl": 3, "summary": False, "crit": True,
        "name": "Especificación formal de requerimientos (SRS - RF-1 a RF-5)",
        "dur": 2, "start": "2026-09-01T08:00:00", "finish": "2026-09-02T17:00:00",
        "preds": [8], "assignees": [(1, 0.5), (2, 0.5)], "sem": "V"
    },
    {
        "uid": 10, "id": 10, "wbs": "1.2.4", "lvl": 3, "summary": False, "crit": True,
        "name": "Priorización MoSCoW y definición de Criterios de Aceptación CA1 a CA6",
        "dur": 1, "start": "2026-09-03T08:00:00", "finish": "2026-09-03T17:00:00",
        "preds": [9], "assignees": [(1, 0.5), (3, 0.5)], "sem": "V"
    },
    {
        "uid": 11, "id": 11, "wbs": "1.2.5", "lvl": 3, "summary": False, "crit": False,
        "name": "Armado del diagrama de contexto del sistema",
        "dur": 1, "start": "2026-09-03T08:00:00", "finish": "2026-09-03T17:00:00",
        "preds": [10], "assignees": [(3, 1.0)], "sem": "T"
    },
    {
        "uid": 12, "id": 12, "wbs": "1.2.6", "lvl": 3, "summary": False, "crit": True,
        "name": "Armado del Diagrama de Flujo de Datos (DFD) Nivel 0",
        "dur": 1, "start": "2026-09-04T08:00:00", "finish": "2026-09-04T17:00:00",
        "preds": [11], "assignees": [(3, 0.5), (1, 0.5)], "sem": "V"
    },
    {
        "uid": 13, "id": 13, "wbs": "1.2.7", "lvl": 3, "summary": False, "crit": False,
        "name": "Armado del Diagrama de Flujo de Datos (DFD) Nivel 1",
        "dur": 2, "start": "2026-09-04T08:00:00", "finish": "2026-09-07T17:00:00",
        "preds": [12], "assignees": [(3, 0.5), (4, 0.5)], "sem": "T"
    },
    {
        "uid": 14, "id": 14, "wbs": "1.2.8", "lvl": 3, "summary": False, "crit": False,
        "name": "Armado del diccionario de datos y modelos de persistencia",
        "dur": 2, "start": "2026-09-07T08:00:00", "finish": "2026-09-08T17:00:00",
        "preds": [13], "assignees": [(4, 0.5), (3, 0.5)], "sem": "V"
    },
    {
        "uid": 15, "id": 15, "wbs": "1.2.9", "lvl": 3, "summary": False, "crit": True,
        "name": "Creación del MS Project y plan de gestión",
        "dur": 2, "start": "2026-09-07T08:00:00", "finish": "2026-09-08T17:00:00",
        "preds": [10], "assignees": [(1, 0.5), (2, 0.5)], "sem": "V"
    },
    {
        "uid": 16, "id": 16, "wbs": "1.2.10", "lvl": 3, "summary": False, "crit": True,
        "name": "Armado de la red PERT/CPM y cálculo de holguras",
        "dur": 2, "start": "2026-09-08T08:00:00", "finish": "2026-09-09T17:00:00",
        "preds": [15], "assignees": [(1, 0.5), (3, 0.5)], "sem": "V"
    },
    {
        "uid": 17, "id": 17, "wbs": "1.2.11", "lvl": 3, "summary": False, "crit": True,
        "name": "Armado del cronograma Gantt y análisis de varianza",
        "dur": 1, "start": "2026-09-09T08:00:00", "finish": "2026-09-09T17:00:00",
        "preds": [16], "assignees": [(2, 0.5), (1, 0.5)], "sem": "V"
    },
    {
        "uid": 18, "id": 18, "wbs": "1.2.12", "lvl": 3, "summary": False, "crit": False,
        "name": "Creación de la matriz RACI",
        "dur": 1, "start": "2026-09-09T08:00:00", "finish": "2026-09-09T17:00:00",
        "preds": [15], "assignees": [(2, 0.5), (6, 0.5)], "sem": "T"
    },
    {
        "uid": 19, "id": 19, "wbs": "1.2.13", "lvl": 3, "summary": False, "crit": True,
        "name": "Creación de la matriz de riesgos y control semáforo",
        "dur": 1, "start": "2026-09-10T08:00:00", "finish": "2026-09-10T17:00:00",
        "preds": [18], "assignees": [(3, 0.5), (1, 0.5)], "sem": "V"
    },

    # FASE 3: 1.3 Diseño UX/UI, Wireframes y Accesibilidad
    {
        "uid": 20, "id": 20, "wbs": "1.3", "lvl": 2, "summary": True, "crit": False,
        "name": "Diseño UX/UI, Wireframes y Accesibilidad",
        "dur": 5, "start": "2026-09-07T08:00:00", "finish": "2026-09-11T17:00:00",
        "preds": [9], "assignees": [], "sem": "T"
    },
    {
        "uid": 21, "id": 21, "wbs": "1.3.1", "lvl": 3, "summary": False, "crit": False,
        "name": "Diseño de wireframes y flujos de navegación en Padlet",
        "dur": 2, "start": "2026-09-07T08:00:00", "finish": "2026-09-08T17:00:00",
        "preds": [9], "assignees": [(2, 0.5), (7, 0.5)], "sem": "T"
    },
    {
        "uid": 22, "id": 22, "wbs": "1.3.2", "lvl": 3, "summary": False, "crit": False,
        "name": "Prueba de usabilidad temprana con vecina real de Pilar",
        "dur": 1, "start": "2026-09-09T08:00:00", "finish": "2026-09-09T17:00:00",
        "preds": [21], "assignees": [(2, 0.5), (7, 0.5)], "sem": "V"
    },
    {
        "uid": 23, "id": 23, "wbs": "1.3.3", "lvl": 3, "summary": False, "crit": False,
        "name": "Auditoría de accesibilidad WCAG 2.1 AA (contraste 13.5:1 y táctil >=48dp)",
        "dur": 1, "start": "2026-09-10T08:00:00", "finish": "2026-09-10T17:00:00",
        "preds": [22], "assignees": [(2, 0.5), (6, 0.5)], "sem": "V"
    },
    {
        "uid": 24, "id": 24, "wbs": "1.3.4", "lvl": 3, "summary": False, "crit": False,
        "name": "Evaluación heurística según las 10 reglas de Jakob Nielsen",
        "dur": 1, "start": "2026-09-11T08:00:00", "finish": "2026-09-11T17:00:00",
        "preds": [23], "assignees": [(2, 0.5), (6, 0.5)], "sem": "T"
    },
    {
        "uid": 25, "id": 25, "wbs": "1.3.5", "lvl": 3, "summary": False, "crit": True,
        "name": "Definición de tokens de diseño y paleta de colores (theme.ts)",
        "dur": 2, "start": "2026-09-09T08:00:00", "finish": "2026-09-10T17:00:00",
        "preds": [21], "assignees": [(1, 0.5), (2, 0.5)], "sem": "V"
    },

    # FASE 4: 1.4 Setup de Arquitectura Base y Persistencia
    {
        "uid": 26, "id": 26, "wbs": "1.4", "lvl": 2, "summary": True, "crit": True,
        "name": "Setup de Arquitectura Base y Persistencia",
        "dur": 10, "start": "2026-09-07T08:00:00", "finish": "2026-09-18T17:00:00",
        "preds": [5], "assignees": [], "sem": "R"
    },
    {
        "uid": 27, "id": 27, "wbs": "1.4.1", "lvl": 3, "summary": False, "crit": True,
        "name": "Inicialización de Expo SDK 57 con Expo Router",
        "dur": 2, "start": "2026-09-07T08:00:00", "finish": "2026-09-08T17:00:00",
        "preds": [5], "assignees": [(1, 0.5), (5, 0.5)], "sem": "V"
    },
    {
        "uid": 28, "id": 28, "wbs": "1.4.2", "lvl": 3, "summary": False, "crit": True,
        "name": "Configuración de TypeScript estricto y convenciones de código",
        "dur": 1, "start": "2026-09-09T08:00:00", "finish": "2026-09-09T17:00:00",
        "preds": [27], "assignees": [(1, 1.0)], "sem": "T"
    },
    {
        "uid": 29, "id": 29, "wbs": "1.4.3", "lvl": 3, "summary": False, "crit": True,
        "name": "Creación del Singleton ConexionFirebase (Auth, Firestore, Storage)",
        "dur": 4, "start": "2026-09-10T08:00:00", "finish": "2026-09-15T17:00:00",
        "preds": [28], "assignees": [(1, 0.5), (2, 0.5)], "sem": "R"
    },
    {
        "uid": 30, "id": 30, "wbs": "1.4.4", "lvl": 3, "summary": False, "crit": True,
        "name": "Implementación de persistencia de sesión con AsyncStorage",
        "dur": 3, "start": "2026-09-16T08:00:00", "finish": "2026-09-18T17:00:00",
        "preds": [29], "assignees": [(1, 0.5), (5, 0.5)], "sem": "A"
    },

    # FASE 5: 1.5 Módulo de Autenticación y Perfil de Usuario (RF-1)
    {
        "uid": 31, "id": 31, "wbs": "1.5", "lvl": 2, "summary": True, "crit": True,
        "name": "Módulo de Autenticación y Perfil de Usuario",
        "dur": 13, "start": "2026-09-14T08:00:00", "finish": "2026-09-30T17:00:00",
        "preds": [25], "assignees": [], "sem": "A"
    },
    {
        "uid": 32, "id": 32, "wbs": "1.5.1", "lvl": 3, "summary": False, "crit": False,
        "name": "Maquetación de pantallas de Login y Registro",
        "dur": 2, "start": "2026-09-14T08:00:00", "finish": "2026-09-15T17:00:00",
        "preds": [25], "assignees": [(5, 0.5), (2, 0.5)], "sem": "T"
    },
    {
        "uid": 33, "id": 33, "wbs": "1.5.2", "lvl": 3, "summary": False, "crit": False,
        "name": "Esquemas de validación Zod para credenciales y datos personales",
        "dur": 2, "start": "2026-09-16T08:00:00", "finish": "2026-09-17T17:00:00",
        "preds": [32], "assignees": [(5, 1.0)], "sem": "T"
    },
    {
        "uid": 34, "id": 34, "wbs": "1.5.3", "lvl": 3, "summary": False, "crit": True,
        "name": "Integración con Firebase Authentication",
        "dur": 3, "start": "2026-09-18T08:00:00", "finish": "2026-09-22T17:00:00",
        "preds": [30, 33], "assignees": [(5, 0.5), (1, 0.5)], "sem": "A"
    },
    {
        "uid": 35, "id": 35, "wbs": "1.5.4", "lvl": 3, "summary": False, "crit": True,
        "name": "Implementación de AuthContext y manejo reactivo de sesión",
        "dur": 2, "start": "2026-09-23T08:00:00", "finish": "2026-09-24T17:00:00",
        "preds": [34], "assignees": [(1, 0.5), (5, 0.5)], "sem": "V"
    },
    {
        "uid": 36, "id": 36, "wbs": "1.5.5", "lvl": 3, "summary": False, "crit": False,
        "name": "Pantalla de Perfil de Usuario y gestión de datos de contacto",
        "dur": 2, "start": "2026-09-25T08:00:00", "finish": "2026-09-28T17:00:00",
        "preds": [35], "assignees": [(5, 1.0)], "sem": "T"
    },
    {
        "uid": 37, "id": 37, "wbs": "1.5.6", "lvl": 3, "summary": False, "crit": False,
        "name": "Sincronización persistente de foto de perfil en Firebase Storage",
        "dur": 2, "start": "2026-09-29T08:00:00", "finish": "2026-09-30T17:00:00",
        "preds": [36], "assignees": [(1, 0.5), (5, 0.5)], "sem": "V"
    },

    # FASE 6: 1.6 Módulo de Mapa Interactivo y Geolocalización (RF-3)
    {
        "uid": 38, "id": 38, "wbs": "1.6", "lvl": 2, "summary": True, "crit": True,
        "name": "Módulo de Mapa Interactivo y Geolocalización",
        "dur": 18, "start": "2026-09-10T08:00:00", "finish": "2026-10-05T17:00:00",
        "preds": [28], "assignees": [], "sem": "R"
    },
    {
        "uid": 39, "id": 39, "wbs": "1.6.1", "lvl": 3, "summary": False, "crit": True,
        "name": "Implementación inicial de mapa nativo (detección de pantalla negra)",
        "dur": 4, "start": "2026-09-10T08:00:00", "finish": "2026-09-15T17:00:00",
        "preds": [28], "assignees": [(7, 0.5), (1, 0.5)], "sem": "R"
    },
    {
        "uid": 40, "id": 40, "wbs": "1.6.2", "lvl": 3, "summary": False, "crit": True,
        "name": "Refactorización arquitectónica a Leaflet 1.9.4 sobre WebView",
        "dur": 4, "start": "2026-09-16T08:00:00", "finish": "2026-09-21T17:00:00",
        "preds": [39], "assignees": [(1, 0.5), (7, 0.5)], "sem": "R"
    },
    {
        "uid": 41, "id": 41, "wbs": "1.6.3", "lvl": 3, "summary": False, "crit": True,
        "name": "Integración de capas libres CartoDB Voyager y OpenStreetMap",
        "dur": 2, "start": "2026-09-22T08:00:00", "finish": "2026-09-23T17:00:00",
        "preds": [40], "assignees": [(1, 0.5), (4, 0.5)], "sem": "V"
    },
    {
        "uid": 42, "id": 42, "wbs": "1.6.4", "lvl": 3, "summary": False, "crit": True,
        "name": "Construcción del puente bidireccional postMessage para eventos táctiles",
        "dur": 2, "start": "2026-09-24T08:00:00", "finish": "2026-09-25T17:00:00",
        "preds": [41], "assignees": [(1, 1.0)], "sem": "V"
    },
    {
        "uid": 43, "id": 43, "wbs": "1.6.5", "lvl": 3, "summary": False, "crit": True,
        "name": "Hook de gestión de estado useMapState y centrado de cámara",
        "dur": 3, "start": "2026-09-28T08:00:00", "finish": "2026-09-30T17:00:00",
        "preds": [42], "assignees": [(4, 0.5), (1, 0.5)], "sem": "V"
    },
    {
        "uid": 44, "id": 44, "wbs": "1.6.6", "lvl": 3, "summary": False, "crit": True,
        "name": "Algoritmo de validación de coordenadas geoValidation de Pilar",
        "dur": 2, "start": "2026-09-29T08:00:00", "finish": "2026-09-30T17:00:00",
        "preds": [43], "assignees": [(4, 0.5), (3, 0.5)], "sem": "V"
    },
    {
        "uid": 45, "id": 45, "wbs": "1.6.7", "lvl": 3, "summary": False, "crit": True,
        "name": "Renderizado dinámico de marcadores y tarjetas flotantes de alerta",
        "dur": 3, "start": "2026-10-01T08:00:00", "finish": "2026-10-05T17:00:00",
        "preds": [44], "assignees": [(4, 0.5), (7, 0.5)], "sem": "V"
    },

    # FASE 7: 1.7 Módulo de Publicación de Alertas de Mascotas (RF-2)
    {
        "uid": 46, "id": 46, "wbs": "1.7", "lvl": 2, "summary": True, "crit": True,
        "name": "Módulo de Publicación de Alertas de Mascotas",
        "dur": 11, "start": "2026-09-25T08:00:00", "finish": "2026-10-09T17:00:00",
        "preds": [35], "assignees": [], "sem": "R"
    },
    {
        "uid": 47, "id": 47, "wbs": "1.7.1", "lvl": 3, "summary": False, "crit": True,
        "name": "Formulario guiado de publicación (Perdido, Encontrado, Avistado)",
        "dur": 3, "start": "2026-09-25T08:00:00", "finish": "2026-09-29T17:00:00",
        "preds": [35], "assignees": [(4, 0.5), (3, 0.5)], "sem": "T"
    },
    {
        "uid": 48, "id": 48, "wbs": "1.7.2", "lvl": 3, "summary": False, "crit": False,
        "name": "Integración de presets geográficos de barrios de Pilar",
        "dur": 2, "start": "2026-09-30T08:00:00", "finish": "2026-10-01T17:00:00",
        "preds": [47], "assignees": [(4, 1.0)], "sem": "V"
    },
    {
        "uid": 49, "id": 49, "wbs": "1.7.3", "lvl": 3, "summary": False, "crit": True,
        "name": "Captura y selección fotográfica con expo-image-picker",
        "dur": 2, "start": "2026-10-01T08:00:00", "finish": "2026-10-02T17:00:00",
        "preds": [47], "assignees": [(4, 0.5), (3, 0.5)], "sem": "T"
    },
    {
        "uid": 50, "id": 50, "wbs": "1.7.4", "lvl": 3, "summary": False, "crit": True,
        "name": "Solución de subida de fotos en Base64 a Firebase Storage",
        "dur": 3, "start": "2026-10-05T08:00:00", "finish": "2026-10-07T17:00:00",
        "preds": [49], "assignees": [(1, 0.5), (4, 0.5)], "sem": "R"
    },
    {
        "uid": 51, "id": 51, "wbs": "1.7.5", "lvl": 3, "summary": False, "crit": True,
        "name": "Escritura y sanitización en colección alertas de Firestore",
        "dur": 2, "start": "2026-10-08T08:00:00", "finish": "2026-10-09T17:00:00",
        "preds": [50], "assignees": [(4, 0.5), (3, 0.5)], "sem": "V"
    },

    # FASE 8: 1.8 Módulo de Feed de Alertas (Home) y Búsqueda (RF-3)
    {
        "uid": 52, "id": 52, "wbs": "1.8", "lvl": 2, "summary": True, "crit": False,
        "name": "Módulo de Feed de Alertas (Home) y Búsqueda",
        "dur": 11, "start": "2026-09-24T08:00:00", "finish": "2026-10-08T17:00:00",
        "preds": [25], "assignees": [], "sem": "A"
    },
    {
        "uid": 53, "id": 53, "wbs": "1.8.1", "lvl": 3, "summary": False, "crit": False,
        "name": "Diseño modular de tarjetas de mascota (PetCard)",
        "dur": 2, "start": "2026-09-24T08:00:00", "finish": "2026-09-25T17:00:00",
        "preds": [25], "assignees": [(6, 0.5), (2, 0.5)], "sem": "T"
    },
    {
        "uid": 54, "id": 54, "wbs": "1.8.2", "lvl": 3, "summary": False, "crit": False,
        "name": "Conexión en tiempo real a Firestore y pull-to-refresh",
        "dur": 3, "start": "2026-09-28T08:00:00", "finish": "2026-09-30T17:00:00",
        "preds": [53, 29], "assignees": [(6, 0.5), (4, 0.5)], "sem": "A"
    },
    {
        "uid": 55, "id": 55, "wbs": "1.8.3", "lvl": 3, "summary": False, "crit": False,
        "name": "Filtros interactivos por especie y estado del animal",
        "dur": 2, "start": "2026-10-01T08:00:00", "finish": "2026-10-02T17:00:00",
        "preds": [54], "assignees": [(6, 0.5), (4, 0.5)], "sem": "V"
    },
    {
        "uid": 56, "id": 56, "wbs": "1.8.4", "lvl": 3, "summary": False, "crit": False,
        "name": "Barra de búsqueda rápida por nombre, barrio y características",
        "dur": 2, "start": "2026-10-05T08:00:00", "finish": "2026-10-06T17:00:00",
        "preds": [55], "assignees": [(6, 1.0)], "sem": "V"
    },
    {
        "uid": 57, "id": 57, "wbs": "1.8.5", "lvl": 3, "summary": False, "crit": False,
        "name": "Fallback resiliente ante pérdida de conexión (MOCK_MASCOTAS)",
        "dur": 2, "start": "2026-10-07T08:00:00", "finish": "2026-10-08T17:00:00",
        "preds": [56], "assignees": [(6, 0.5), (3, 0.5)], "sem": "V"
    },

    # FASE 9: 1.9 Módulo de Ficha Detalle y Redirección Comunitaria (RF-4)
    {
        "uid": 58, "id": 58, "wbs": "1.9", "lvl": 2, "summary": True, "crit": True,
        "name": "Módulo de Ficha Detalle y Redirección Comunitaria",
        "dur": 9, "start": "2026-10-06T08:00:00", "finish": "2026-10-16T17:00:00",
        "preds": [51, 54], "assignees": [], "sem": "V"
    },
    {
        "uid": 59, "id": 59, "wbs": "1.9.1", "lvl": 3, "summary": False, "crit": True,
        "name": "Pantalla dinámica de detalle de mascota (/detalle/[id].tsx)",
        "dur": 3, "start": "2026-10-06T08:00:00", "finish": "2026-10-08T17:00:00",
        "preds": [51, 54], "assignees": [(3, 0.5), (6, 0.5)], "sem": "T"
    },
    {
        "uid": 60, "id": 60, "wbs": "1.9.2", "lvl": 3, "summary": False, "crit": True,
        "name": "Enlace profundo a WhatsApp (wa.me) con mensaje contextualizado",
        "dur": 2, "start": "2026-10-09T08:00:00", "finish": "2026-10-12T17:00:00",
        "preds": [59], "assignees": [(3, 0.5), (1, 0.5)], "sem": "V"
    },
    {
        "uid": 61, "id": 61, "wbs": "1.9.3", "lvl": 3, "summary": False, "crit": True,
        "name": "Botón de avistamiento comunitario ('¡Lo vi!') con GPS",
        "dur": 2, "start": "2026-10-13T08:00:00", "finish": "2026-10-14T17:00:00",
        "preds": [60], "assignees": [(3, 0.5), (2, 0.5)], "sem": "V"
    },
    {
        "uid": 62, "id": 62, "wbs": "1.9.4", "lvl": 3, "summary": False, "crit": False,
        "name": "Integración de API nativa para compartir publicación en redes",
        "dur": 2, "start": "2026-10-14T08:00:00", "finish": "2026-10-15T17:00:00",
        "preds": [59], "assignees": [(6, 0.5), (2, 0.5)], "sem": "T"
    },
    {
        "uid": 63, "id": 63, "wbs": "1.9.5", "lvl": 3, "summary": False, "crit": False,
        "name": "Marcado de alerta como 'Mascota encontrada' y cierre de caso",
        "dur": 2, "start": "2026-10-15T08:00:00", "finish": "2026-10-16T17:00:00",
        "preds": [61], "assignees": [(2, 0.5), (3, 0.5)], "sem": "V"
    },
    {
        "uid": 64, "id": 64, "wbs": "1.9.6", "lvl": 3, "summary": False, "crit": False,
        "name": "Eliminación de publicación con validación estricta de autorId",
        "dur": 2, "start": "2026-10-15T08:00:00", "finish": "2026-10-16T17:00:00",
        "preds": [59, 36], "assignees": [(5, 0.5), (3, 0.5)], "sem": "V"
    },

    # FASE 10: 1.10 Centro de Soporte, Ayuda y Portada (RF-5)
    {
        "uid": 65, "id": 65, "wbs": "1.10", "lvl": 2, "summary": True, "crit": False,
        "name": "Centro de Soporte, Ayuda y Portada",
        "dur": 25, "start": "2026-09-16T08:00:00", "finish": "2026-10-21T17:00:00",
        "preds": [25], "assignees": [], "sem": "V"
    },
    {
        "uid": 66, "id": 66, "wbs": "1.10.1", "lvl": 3, "summary": False, "crit": False,
        "name": "Diseño de vista de soporte con selector de pestañas",
        "dur": 2, "start": "2026-09-16T08:00:00", "finish": "2026-09-17T17:00:00",
        "preds": [25], "assignees": [(2, 0.5), (1, 0.5)], "sem": "T"
    },
    {
        "uid": 67, "id": 67, "wbs": "1.10.2", "lvl": 3, "summary": False, "crit": False,
        "name": "Acordeón interactivo con las 9 preguntas frecuentes oficiales",
        "dur": 2, "start": "2026-09-18T08:00:00", "finish": "2026-09-21T17:00:00",
        "preds": [66], "assignees": [(2, 0.5), (6, 0.5)], "sem": "V"
    },
    {
        "uid": 68, "id": 68, "wbs": "1.10.3", "lvl": 3, "summary": False, "crit": False,
        "name": "Formulario de tickets y persistencia en tickets_soporte",
        "dur": 3, "start": "2026-10-19T08:00:00", "finish": "2026-10-21T17:00:00",
        "preds": [67, 29], "assignees": [(2, 0.5), (1, 0.5)], "sem": "V"
    },
    {
        "uid": 69, "id": 69, "wbs": "1.10.4", "lvl": 3, "summary": False, "crit": False,
        "name": "Guía de uso interactiva en 4 pasos (GuiaDeUso.tsx)",
        "dur": 2, "start": "2026-10-09T08:00:00", "finish": "2026-10-12T17:00:00",
        "preds": [67], "assignees": [(2, 1.0)], "sem": "T"
    },
    {
        "uid": 70, "id": 70, "wbs": "1.10.5", "lvl": 3, "summary": False, "crit": False,
        "name": "Pantalla de Bienvenida interactiva y modo invitado",
        "dur": 2, "start": "2026-10-19T08:00:00", "finish": "2026-10-20T17:00:00",
        "preds": [69], "assignees": [(1, 0.5), (6, 0.5)], "sem": "V"
    },
    {
        "uid": 71, "id": 71, "wbs": "1.10.6", "lvl": 3, "summary": False, "crit": False,
        "name": "Pantalla de Ajustes de la aplicación",
        "dur": 1, "start": "2026-10-01T08:00:00", "finish": "2026-10-01T17:00:00",
        "preds": [25], "assignees": [(6, 1.0)], "sem": "T"
    },

    # FASE 11: 1.11 Aseguramiento de Calidad, Testing y Verificación (Testware)
    {
        "uid": 72, "id": 72, "wbs": "1.11", "lvl": 2, "summary": True, "crit": True,
        "name": "Aseguramiento de Calidad, Testing y Verificación (Testware)",
        "dur": 35, "start": "2026-09-07T08:00:00", "finish": "2026-10-23T17:00:00",
        "preds": [9], "assignees": [], "sem": "V"
    },
    {
        "uid": 73, "id": 73, "wbs": "1.11.1", "lvl": 3, "summary": False, "crit": False,
        "name": "Diseño del Plan Maestro de Pruebas y Matriz de Casos",
        "dur": 3, "start": "2026-09-07T08:00:00", "finish": "2026-09-09T17:00:00",
        "preds": [9], "assignees": [(3, 0.5), (1, 0.5)], "sem": "V"
    },
    {
        "uid": 74, "id": 74, "wbs": "1.11.2", "lvl": 3, "summary": False, "crit": True,
        "name": "Suite de pruebas de estrés, concurrencia y fuzzing (19 tests)",
        "dur": 3, "start": "2026-10-12T08:00:00", "finish": "2026-10-14T17:00:00",
        "preds": [73, 56], "assignees": [(3, 0.5), (4, 0.5)], "sem": "V"
    },
    {
        "uid": 75, "id": 75, "wbs": "1.11.3", "lvl": 3, "summary": False, "crit": True,
        "name": "Suite de pruebas de integración y seguridad de autor (10 tests)",
        "dur": 3, "start": "2026-10-15T08:00:00", "finish": "2026-10-19T17:00:00",
        "preds": [64, 36], "assignees": [(3, 0.5), (5, 0.5)], "sem": "V"
    },
    {
        "uid": 76, "id": 76, "wbs": "1.11.4", "lvl": 3, "summary": False, "crit": False,
        "name": "Suite de validación geométrica de límites de Pilar (10 tests)",
        "dur": 2, "start": "2026-10-01T08:00:00", "finish": "2026-10-02T17:00:00",
        "preds": [44], "assignees": [(3, 0.5), (4, 0.5)], "sem": "V"
    },
    {
        "uid": 77, "id": 77, "wbs": "1.11.5", "lvl": 3, "summary": False, "crit": True,
        "name": "Suite de pruebas de WhatsApp y ficha detalle (5 tests)",
        "dur": 2, "start": "2026-10-16T08:00:00", "finish": "2026-10-19T17:00:00",
        "preds": [60], "assignees": [(3, 0.5), (2, 0.5)], "sem": "V"
    },
    {
        "uid": 78, "id": 78, "wbs": "1.11.6", "lvl": 3, "summary": False, "crit": False,
        "name": "Suite de pruebas de publicación y fotos Storage (5 tests)",
        "dur": 2, "start": "2026-10-08T08:00:00", "finish": "2026-10-09T17:00:00",
        "preds": [51], "assignees": [(3, 0.5), (4, 0.5)], "sem": "V"
    },
    {
        "uid": 79, "id": 79, "wbs": "1.11.7", "lvl": 3, "summary": False, "crit": False,
        "name": "Suite de pruebas de UI y FAQs (4 tests)",
        "dur": 2, "start": "2026-09-22T08:00:00", "finish": "2026-09-23T17:00:00",
        "preds": [67], "assignees": [(3, 0.5), (2, 0.5)], "sem": "T"
    },
    {
        "uid": 80, "id": 80, "wbs": "1.11.8", "lvl": 3, "summary": False, "crit": False,
        "name": "Suite de integración de tickets en Firestore (3 tests)",
        "dur": 2, "start": "2026-10-21T08:00:00", "finish": "2026-10-22T17:00:00",
        "preds": [68], "assignees": [(3, 0.5), (2, 0.5)], "sem": "V"
    },
    {
        "uid": 81, "id": 81, "wbs": "1.11.9", "lvl": 3, "summary": False, "crit": False,
        "name": "Suite de marcadores de mapa en Firestore (2 tests)",
        "dur": 2, "start": "2026-10-06T08:00:00", "finish": "2026-10-07T17:00:00",
        "preds": [45], "assignees": [(3, 0.5), (7, 0.5)], "sem": "V"
    },
    {
        "uid": 82, "id": 82, "wbs": "1.11.10", "lvl": 3, "summary": False, "crit": True,
        "name": "Prueba de humo live contra Cloud Firestore (1 test)",
        "dur": 1, "start": "2026-10-22T08:00:00", "finish": "2026-10-22T17:00:00",
        "preds": [80], "assignees": [(3, 0.5), (1, 0.5)], "sem": "V"
    },
    {
        "uid": 83, "id": 83, "wbs": "1.11.11", "lvl": 3, "summary": False, "crit": True,
        "name": "Verificación de regla arquitectónica de menos de 150 líneas",
        "dur": 1, "start": "2026-10-23T08:00:00", "finish": "2026-10-23T17:00:00",
        "preds": [75], "assignees": [(3, 1.0)], "sem": "V"
    },
    {
        "uid": 84, "id": 84, "wbs": "1.11.12", "lvl": 3, "summary": False, "crit": True,
        "name": "Verificación de 0 errores TypeScript (npx tsc --noEmit)",
        "dur": 1, "start": "2026-10-23T08:00:00", "finish": "2026-10-23T17:00:00",
        "preds": [83], "assignees": [(1, 0.5), (3, 0.5)], "sem": "V"
    },

    # FASE 12: 1.12 Cierre de Proyecto, Integración de Ramas y Presentación
    {
        "uid": 85, "id": 85, "wbs": "1.12", "lvl": 2, "summary": True, "crit": True,
        "name": "Cierre de Proyecto, Integración de Ramas y Presentación",
        "dur": 7, "start": "2026-10-16T08:00:00", "finish": "2026-10-26T17:00:00",
        "preds": [75], "assignees": [], "sem": "V"
    },
    {
        "uid": 86, "id": 86, "wbs": "1.12.1", "lvl": 3, "summary": False, "crit": True,
        "name": "Reestructuración del equipo en 3 Células Autónomas (2+2+3)",
        "dur": 2, "start": "2026-10-16T08:00:00", "finish": "2026-10-19T17:00:00",
        "preds": [], "assignees": [(1, 0.5), (2, 0.5)], "sem": "V"
    },
    {
        "uid": 87, "id": 87, "wbs": "1.12.2", "lvl": 3, "summary": False, "crit": True,
        "name": "Conciliación manual y resolución de conflictos de merge en Git",
        "dur": 3, "start": "2026-10-20T08:00:00", "finish": "2026-10-22T17:00:00",
        "preds": [86], "assignees": [(1, 0.5), (3, 0.5)], "sem": "R"
    },
    {
        "uid": 88, "id": 88, "wbs": "1.12.3", "lvl": 3, "summary": False, "crit": True,
        "name": "Ejecución final de la suite completa de 59 tests (100% PASS)",
        "dur": 1, "start": "2026-10-23T08:00:00", "finish": "2026-10-23T17:00:00",
        "preds": [87, 84], "assignees": [(3, 0.5), (1, 0.5)], "sem": "V"
    },
    {
        "uid": 89, "id": 89, "wbs": "1.12.4", "lvl": 3, "summary": False, "crit": True,
        "name": "Consolidación del Plan de Proyecto y Dossier Integral",
        "dur": 2, "start": "2026-10-23T08:00:00", "finish": "2026-10-26T17:00:00",
        "preds": [88], "assignees": [(2, 0.5), (1, 0.5)], "sem": "V"
    },
    {
        "uid": 90, "id": 90, "wbs": "1.12.5", "lvl": 3, "summary": False, "crit": True,
        "name": "Generación del Tablero Maestro de Control en Excel con diagramas",
        "dur": 1, "start": "2026-10-26T08:00:00", "finish": "2026-10-26T17:00:00",
        "preds": [89], "assignees": [(1, 0.5), (2, 0.5)], "sem": "V"
    },
    {
        "uid": 91, "id": 91, "wbs": "1.12.6", "lvl": 3, "summary": False, "crit": True,
        "name": "Compilación del archivo Microsoft Project con semáforos y asignaciones",
        "dur": 1, "start": "2026-10-26T08:00:00", "finish": "2026-10-26T17:00:00",
        "preds": [90], "assignees": [(1, 0.5), (3, 0.5)], "sem": "V"
    },
    {
        "uid": 92, "id": 92, "wbs": "1.12.7", "lvl": 3, "summary": False, "crit": True,
        "name": "Ensayo de defensa técnica y presentación oral ante la cátedra",
        "dur": 1, "start": "2026-10-26T08:00:00", "finish": "2026-10-26T17:00:00",
        "preds": [91], "assignees": [(8, 0.1), (1, 0.15), (2, 0.15), (3, 0.15), (4, 0.15), (5, 0.15), (6, 0.15)], "sem": "V"
    }
]

# -------------------------------------------------------------
# GENERACIÓN DE MICROSOFT PROJECT XML (MSPDI) PROFESIONAL
# -------------------------------------------------------------
def generar_msproject_xml_profesional():
    print("[1/2] Generando archivo Microsoft Project XML profesional con Asignaciones...")
    
    NS = "http://schemas.microsoft.com/project"
    root = ET.Element("Project", xmlns=NS)
    
    # Propiedades del Proyecto
    ET.SubElement(root, "SaveVersion").text = "14"
    ET.SubElement(root, "Name").text = "Patitas Encontradas - Plan de Gestión Integral (UNP)"
    ET.SubElement(root, "Title").text = "Patitas Encontradas — Red Comunitaria de Mascotas en Pilar"
    ET.SubElement(root, "Company").text = "Universidad Nacional de Pilar (UNP) — Cátedra Testing y Calidad"
    ET.SubElement(root, "Author").text = "Jonatan Rosas & Sol Careaga"
    ET.SubElement(root, "Manager").text = "Pedro Brest (Titular) | Jonatan Rosas (PO) | Sol Careaga (SM)"
    ET.SubElement(root, "ScheduleFromStart").text = "1"
    ET.SubElement(root, "StartDate").text = "2026-08-24T08:00:00"
    ET.SubElement(root, "FinishDate").text = "2026-10-26T17:00:00"
    ET.SubElement(root, "FYStartDate").text = "1"
    ET.SubElement(root, "CriticalSlackLimit").text = "0"
    ET.SubElement(root, "CurrencyDigits").text = "2"
    ET.SubElement(root, "CurrencySymbol").text = "$"
    ET.SubElement(root, "CurrencyCode").text = "ARS"
    ET.SubElement(root, "CurrencySymbolPosition").text = "0"
    ET.SubElement(root, "CalendarUID").text = "1"
    ET.SubElement(root, "DefaultStartTime").text = "08:00:00"
    ET.SubElement(root, "DefaultFinishTime").text = "17:00:00"
    ET.SubElement(root, "MinutesPerDay").text = "480"
    ET.SubElement(root, "MinutesPerWeek").text = "2400"
    ET.SubElement(root, "DaysPerMonth").text = "20"
    ET.SubElement(root, "DefaultTaskType").text = "0"
    ET.SubElement(root, "DurationFormat").text = "7"
    ET.SubElement(root, "WorkFormat").text = "2"
    ET.SubElement(root, "EditableActualCosts").text = "0"
    ET.SubElement(root, "HonorConstraints").text = "1"
    ET.SubElement(root, "EarnedValueMethod").text = "0"
    ET.SubElement(root, "BaselineForEarnedValue").text = "0"
    ET.SubElement(root, "AutoAddNewResourcesAndTasks").text = "1"
    ET.SubElement(root, "StatusDate").text = "2026-10-26T17:00:00"
    ET.SubElement(root, "CurrentDate").text = "2026-10-26T17:00:00"
    ET.SubElement(root, "NewTasksAreManual").text = "0"
    
    # ExtendedAttributes (Semáforo en Text1 y Métricas Number1..Number6)
    ext_attrs = ET.SubElement(root, "ExtendedAttributes")
    
    # 188743731 -> Text1 (Semáforo / Costos)
    ea_text1 = ET.SubElement(ext_attrs, "ExtendedAttribute")
    ET.SubElement(ea_text1, "FieldID").text = "188743731"
    ET.SubElement(ea_text1, "FieldName").text = "Text1"
    ET.SubElement(ea_text1, "Alias").text = "Costos"
    
    # Number1..Number6
    num_fields = [
        ("188743767", "Number1"),
        ("188743768", "Number2"),
        ("188743769", "Number3"),
        ("188743770", "Number4"),
        ("188743771", "Number5"),
        ("188743982", "Number6")
    ]
    for fid, fn in num_fields:
        ea_num = ET.SubElement(ext_attrs, "ExtendedAttribute")
        ET.SubElement(ea_num, "FieldID").text = fid
        ET.SubElement(ea_num, "FieldName").text = fn

    # Calendarios
    calendars = ET.SubElement(root, "Calendars")
    cal = ET.SubElement(calendars, "Calendar")
    ET.SubElement(cal, "UID").text = "1"
    ET.SubElement(cal, "Name").text = "Estándar"
    ET.SubElement(cal, "IsBaseCalendar").text = "1"
    weekdays = ET.SubElement(cal, "WeekDays")
    for day_num in range(1, 8):
        wd = ET.SubElement(weekdays, "WeekDay")
        ET.SubElement(wd, "DayType").text = str(day_num)
        if 2 <= day_num <= 6:
            ET.SubElement(wd, "DayWorking").text = "1"
            wtimes = ET.SubElement(wd, "WorkingTimes")
            wt1 = ET.SubElement(wtimes, "WorkingTime")
            ET.SubElement(wt1, "FromTime").text = "08:00:00"
            ET.SubElement(wt1, "ToTime").text = "12:00:00"
            wt2 = ET.SubElement(wtimes, "WorkingTime")
            ET.SubElement(wt2, "FromTime").text = "13:00:00"
            ET.SubElement(wt2, "ToTime").text = "17:00:00"
        else:
            ET.SubElement(wd, "DayWorking").text = "0"

    # Tasks
    tasks_el = ET.SubElement(root, "Tasks")
    for item in TAREAS_MASTER:
        t = ET.SubElement(tasks_el, "Task")
        ET.SubElement(t, "UID").text = str(item["uid"])
        ET.SubElement(t, "ID").text = str(item["id"])
        ET.SubElement(t, "Name").text = item["name"]
        ET.SubElement(t, "Active").text = "1"
        ET.SubElement(t, "Manual").text = "0"
        ET.SubElement(t, "Type").text = "0" if not item["summary"] else "1"
        ET.SubElement(t, "IsNull").text = "0"
        ET.SubElement(t, "WBS").text = item["wbs"]
        ET.SubElement(t, "OutlineNumber").text = item["wbs"]
        ET.SubElement(t, "OutlineLevel").text = str(item["lvl"])
        ET.SubElement(t, "Priority").text = "500"
        ET.SubElement(t, "Start").text = item["start"]
        ET.SubElement(t, "Finish").text = item["finish"]
        
        dur_h = item["dur"] * 8
        ET.SubElement(t, "Duration").text = f"PT{dur_h}H0M0S"
        ET.SubElement(t, "DurationFormat").text = "7"
        ET.SubElement(t, "Work").text = f"PT{dur_h}H0M0S"
        ET.SubElement(t, "PercentComplete").text = "100"
        ET.SubElement(t, "PercentWorkComplete").text = "100"
        ET.SubElement(t, "ActualStart").text = item["start"]
        ET.SubElement(t, "ActualFinish").text = item["finish"]
        ET.SubElement(t, "ActualDuration").text = f"PT{dur_h}H0M0S"
        ET.SubElement(t, "Summary").text = "1" if item["summary"] else "0"
        ET.SubElement(t, "Critical").text = "1" if item["crit"] else "0"
        ET.SubElement(t, "Milestone").text = "0"
        
        # Predecesoras
        for pred_uid in item["preds"]:
            pl = ET.SubElement(t, "PredecessorLink")
            ET.SubElement(pl, "PredecessorUID").text = str(pred_uid)
            ET.SubElement(pl, "Type").text = "1" # Finish-to-Start (FS)
            ET.SubElement(pl, "LinkLag").text = "0"

        # ExtendedAttribute Text1 (Semáforo)
        ea_sem = ET.SubElement(t, "ExtendedAttribute")
        ET.SubElement(ea_sem, "FieldID").text = "188743731"
        ET.SubElement(ea_sem, "Value").text = item["sem"]

        # Number attributes
        ea_n1 = ET.SubElement(t, "ExtendedAttribute")
        ET.SubElement(ea_n1, "FieldID").text = "188743767"
        ET.SubElement(ea_n1, "Value").text = str(item["dur"])

        ea_n2 = ET.SubElement(t, "ExtendedAttribute")
        ET.SubElement(ea_n2, "FieldID").text = "188743768"
        ET.SubElement(ea_n2, "Value").text = str(dur_h)

        ea_n6 = ET.SubElement(t, "ExtendedAttribute")
        ET.SubElement(ea_n6, "FieldID").text = "188743982"
        ET.SubElement(ea_n6, "Value").text = "100"

    # Resources
    resources_el = ET.SubElement(root, "Resources")
    for r in RECURSOS:
        res = ET.SubElement(resources_el, "Resource")
        ET.SubElement(res, "UID").text = str(r["uid"])
        ET.SubElement(res, "ID").text = str(r["uid"])
        ET.SubElement(res, "Name").text = r["nombre"]
        ET.SubElement(res, "Type").text = "1" # Trabajo
        ET.SubElement(res, "IsNull").text = "0"
        ET.SubElement(res, "Initials").text = r["iniciales"]
        ET.SubElement(res, "Group").text = r["grupo"]
        ET.SubElement(res, "MaxUnits").text = "1.00"
        ET.SubElement(res, "PeakUnits").text = "1.00"
        ET.SubElement(res, "OverAllocated").text = "0"
        ET.SubElement(res, "StandardRate").text = str(r["rate"])
        ET.SubElement(res, "StandardRateFormat").text = "2"
        ET.SubElement(res, "CalendarUID").text = "1"

    # Assignments (¡ESTO ES LO QUE HACE QUE APAREZCAN LOS NOMBRES AL LADO DE LAS BARRAS!)
    assignments_el = ET.SubElement(root, "Assignments")
    assign_id = 1000
    for task in TAREAS_MASTER:
        if task["summary"] or not task["assignees"]:
            continue
        
        task_uid = task["uid"]
        task_dur_h = task["dur"] * 8
        num_assignees = len(task["assignees"])
        
        for res_uid, units in task["assignees"]:
            work_h = int(task_dur_h * units)
            if work_h == 0:
                work_h = max(1, int(task_dur_h / num_assignees))
                
            asn = ET.SubElement(assignments_el, "Assignment")
            ET.SubElement(asn, "UID").text = str(assign_id)
            assign_id += 1
            ET.SubElement(asn, "TaskUID").text = str(task_uid)
            ET.SubElement(asn, "ResourceUID").text = str(res_uid)
            ET.SubElement(asn, "PercentWorkComplete").text = "100"
            ET.SubElement(asn, "ActualStart").text = task["start"]
            ET.SubElement(asn, "ActualFinish").text = task["finish"]
            ET.SubElement(asn, "ActualWork").text = f"PT{work_h}H0M0S"
            ET.SubElement(asn, "Start").text = task["start"]
            ET.SubElement(asn, "Finish").text = task["finish"]
            ET.SubElement(asn, "Units").text = str(units)
            ET.SubElement(asn, "Work").text = f"PT{work_h}H0M0S"
            ET.SubElement(asn, "HasFixedRateUnits").text = "1"
            ET.SubElement(asn, "FixedMaterial").text = "0"
            ET.SubElement(asn, "LevelingDelayFormat").text = "7"
            ET.SubElement(asn, "RegularWork").text = f"PT{work_h}H0M0S"

    # Formatear y guardar XML
    xml_str = ET.tostring(root, encoding="utf-8")
    parsed_xml = minidom.parseString(xml_str)
    pretty_xml = parsed_xml.toprettyxml(indent="  ", encoding="utf-8")
    
    xml_out_path = os.path.join(DOCS_INFORMES, OUTPUT_XML_NAME)
    with open(xml_out_path, "wb") as f:
        f.write(pretty_xml)
        
    print(f"  -> Archivo XML generado con éxito: {xml_out_path} ({os.path.getsize(xml_out_path)/1024:.1f} KB)")
    print(f"  -> Total de Tareas en XML: {len(TAREAS_MASTER)}")
    print(f"  -> Total de Asignaciones vinculadas: {assign_id - 1000}")
    return xml_out_path


# -------------------------------------------------------------
# EJECUCIÓN PRINCIPAL
# -------------------------------------------------------------
def main():
    print("=" * 75)
    print("PERFECCIONAMIENTO DE XML MICROSOFT PROJECT (ASIGNACIONES + NOMBRES DE RECURSOS)")
    print("=" * 75)
    
    xml_path = generar_msproject_xml_profesional()
    
    # Copiar a Root y Docs_Presentaciones
    dest_root_xml = os.path.join(BASE_DIR, OUTPUT_XML_NAME)
    shutil.copy2(xml_path, dest_root_xml)
    print(f"[Copia Root] {dest_root_xml}")
    
    if os.path.exists(DEST_PRESENTACIONES):
        dest_pres_xml = os.path.join(DEST_PRESENTACIONES, OUTPUT_XML_NAME)
        shutil.copy2(xml_path, dest_pres_xml)
        print(f"[Copia Presentaciones] {dest_pres_xml}")
    
    print("=" * 75)
    print("¡XML PERFECCIONADO EXITOSAMENTE CON ASIGNACIONES Y SEMÁFOROS NATIVOS!")
    print("=" * 75)

if __name__ == "__main__":
    main()
