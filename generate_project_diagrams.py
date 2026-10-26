# -*- coding: utf-8 -*-
"""
Generador de Diagramas Visuales de Alta Resolucion (Edicion Editorial / Swiss Grid)
para Patitas Encontradas.
Aplica los principios de design-system, taste-skill (framed-sheet / achromatic-ledger
con acento en datos), ui-ux-pro-max, frontend-design e impeccable, manteniendo el 100%
del rigor tecnico y datos auditados del repositorio Git (114 commits, 59 tests),
Incremento 1 (Bitacora), Etapa 1, Etapa 2 y Planificacion del Sprint 3.
"""

import os
from playwright.sync_api import sync_playwright

OUTPUT_DIR = r"C:\UNI PILAR\AppsMoviles\Patitas_Encontradas\documentacion\diagramas"
os.makedirs(OUTPUT_DIR, exist_ok=True)

BRAND_MARK_SVG = """
<svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="38" height="38" rx="9" fill="#1C1917" stroke="#E86A17" stroke-width="2"/>
  <path d="M20 7C13.9 7 9 11.7 9 17.6C9 24.8 20 33.5 20 33.5C20 33.5 31 24.8 31 17.6C31 11.7 26.1 7 20 7Z" fill="#E86A17" fill-opacity="0.18" stroke="#E86A17" stroke-width="1.8"/>
  <ellipse cx="20" cy="19.8" rx="4.2" ry="3.4" fill="#FAF8F5"/>
  <circle cx="15.2" cy="15.2" r="1.9" fill="#E86A17"/>
  <circle cx="18.3" cy="13.3" r="1.9" fill="#E86A17"/>
  <circle cx="21.7" cy="13.3" r="1.9" fill="#E86A17"/>
  <circle cx="24.8" cy="15.2" r="1.9" fill="#E86A17"/>
</svg>
"""

COMMON_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');

:root {
    /* Three-Layer Token Architecture (Primitive -> Semantic -> Component) */
    --bg-frame: #ECE8DF;
    --bg-sheet: #FCFBF9;
    --bg-surface: #FFFFFF;
    --bg-subtle: #F4F1EA;
    --bg-WarmTint: #FBF6EE;

    --ink-primary: #18181B;
    --ink-secondary: #3F3F46;
    --ink-muted: #71717A;
    --ink-faint: #A1A1AA;

    --border-hairline: #DDD7CD;
    --border-strong: #18181B;
    --border-accent: #E86A17;

    --brand-orange: #E86A17;
    --brand-brown: #432818;

    --crit-red: #C81E1E;
    --crit-bg: #FEF2F2;
    --crit-border: #FCA5A5;

    --warn-amber: #B45309;
    --warn-bg: #FFFBEB;
    --warn-border: #FCD34D;

    --ok-emerald: #047857;
    --ok-bg: #ECFDF5;
    --ok-border: #6EE7B7;

    --plan-blue: #1D4ED8;
    --plan-bg: #EFF6FF;
    --plan-border: #93C5FD;

    --pert-violet: #6D28D9;
    --pert-bg: #F5F3FF;

    --font-display: 'Fraunces', Georgia, serif;
    --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: var(--font-sans);
    background-color: var(--bg-frame);
    background-image: radial-gradient(#D5CFC4 1px, transparent 1px);
    background-size: 16px 16px;
    color: var(--ink-primary);
    padding: 20px;
    -webkit-font-smoothing: antialiased;
    font-variant-numeric: tabular-nums;
}

.canvas-card {
    background: var(--bg-sheet);
    border: 1.5px solid var(--border-strong);
    border-radius: 10px;
    padding: 26px 30px 22px 30px;
    box-shadow: 0 2px 0 #18181B;
    position: relative;
}

/* Editorial Top Masthead */
.masthead {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 18px;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 2px solid var(--border-strong);
    margin-bottom: 16px;
}

.brand-cluster {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-right: 18px;
    border-right: 1px solid var(--border-hairline);
}

.sheet-index {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: var(--brand-orange);
    text-transform: uppercase;
}

.brand-name {
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 800;
    color: var(--ink-primary);
    line-height: 1.15;
}

.brand-scope {
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--ink-muted);
    margin-top: 2px;
}

.header-title h1 {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    color: var(--ink-primary);
    letter-spacing: -0.02em;
    line-height: 1.15;
}

.header-title p {
    font-size: 13px;
    color: var(--ink-secondary);
    margin-top: 4px;
    font-weight: 500;
}

.header-meta-stamp {
    background: var(--bg-surface);
    border: 1px solid var(--border-strong);
    border-left: 4px solid var(--brand-orange);
    padding: 8px 14px;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 11px;
    line-height: 1.45;
    color: var(--ink-primary);
    text-align: right;
}

.header-meta-stamp .stamp-label {
    color: var(--ink-muted);
    font-weight: 600;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* Ruled KPI Ledger Strip (taste-skill §5: one container split by 1px hairlines) */
.kpi-ledger {
    display: grid;
    background: var(--bg-surface);
    border: 1px solid var(--border-hairline);
    border-top: 2px solid var(--ink-primary);
    border-radius: 6px;
    margin-bottom: 18px;
    overflow: hidden;
}

.kpi-cell {
    padding: 11px 16px;
    border-right: 1px solid var(--border-hairline);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.kpi-cell:last-child {
    border-right: none;
}
.kpi-cell.highlight-Finding {
    background: var(--bg-WarmTint);
}

.kpi-eyebrow {
    font-size: 11px;
    font-weight: 600;
    color: var(--ink-muted);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.kpi-figure {
    font-family: var(--font-mono);
    font-size: 22px;
    font-weight: 700;
    color: var(--ink-primary);
    margin: 3px 0;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
}
.kpi-figure.lead {
    font-size: 25px;
    color: var(--brand-orange);
}
.kpi-figure.neg {
    color: var(--crit-red);
}
.kpi-figure.pos {
    color: var(--ok-emerald);
}

.kpi-unit {
    font-size: 12px;
    font-weight: 500;
    color: var(--ink-muted);
}

.kpi-context {
    font-size: 11px;
    color: var(--ink-secondary);
    line-height: 1.3;
}

/* Editorial Footer */
.footer-bar {
    margin-top: 18px;
    padding-top: 10px;
    border-top: 1.5px solid var(--border-strong);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--ink-secondary);
}

.mono {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
}
"""

def build_masthead(sheet_num, title, subtitle, stamp_top, stamp_bot):
    return f"""
    <div class="masthead">
        <div class="brand-cluster">
            {BRAND_MARK_SVG}
            <div>
                <div class="sheet-index">LÁMINA {sheet_num} · UNP-PE-2026</div>
                <div class="brand-name">Patitas Encontradas</div>
                <div class="brand-scope">Municipio de Pilar · Grupo 2</div>
            </div>
        </div>
        <div class="header-title">
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </div>
        <div class="header-meta-stamp">
            <div class="stamp-label">{stamp_top}</div>
            <div><b>{stamp_bot}</b></div>
        </div>
    </div>
    """

# ==============================================================================
# DIAGRAMA 1: EDT / WBS JERARQUICA REAL Y DICCIONARIO OPERATIVO
# ==============================================================================
HTML_01_EDT = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
{COMMON_CSS}
body {{ width: 1700px; }}
.kpi-ledger {{ grid-template-columns: 1.25fr 1fr 1fr 1.15fr 1.3fr; }}

.tree-header-wrap {{
    position: relative;
    margin-bottom: 0px;
}}
.root-banner {{
    background: var(--ink-primary);
    color: #FFFFFF;
    border: 1.5px solid var(--ink-primary);
    border-left: 6px solid var(--brand-orange);
    border-radius: 6px;
    padding: 10px 22px;
    width: 780px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}}
.root-banner .r-title {{
    font-family: var(--font-display);
    font-size: 15.5px;
    font-weight: 700;
    letter-spacing: -0.01em;
}}
.root-banner .r-sub {{
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: #D4D4D8;
    margin-top: 2px;
}}
.root-banner .r-tag {{
    font-family: var(--font-mono);
    font-size: 11px;
    background: #27272A;
    border: 1px solid #52525B;
    color: #FDBA74;
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: 700;
}}

.wbs-grid {{
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 14px;
    align-items: stretch;
}}

.wbs-col {{
    background: var(--bg-subtle);
    border: 1px solid var(--border-hairline);
    border-top: 3px solid var(--ink-primary);
    border-radius: 6px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}}

.col-header {{
    background: var(--bg-surface);
    border: 1px solid var(--border-hairline);
    padding: 8px 10px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}}
.col-header .c-name {{
    font-weight: 800;
    font-size: 12.5px;
    color: var(--ink-primary);
}}
.col-header .c-code {{
    font-family: var(--font-mono);
    font-size: 10.5px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 3px;
    background: var(--ink-primary);
    color: #FFF;
}}

.pkg-card {{
    background: var(--bg-surface);
    border: 1px solid var(--border-hairline);
    border-left: 3.5px solid var(--ink-secondary);
    border-radius: 5px;
    padding: 10px 11px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
}}
.pkg-card.crit {{
    border-left: 4px solid var(--crit-red);
}}
.pkg-card.replan {{
    background: #FFFEFA;
}}

.pkg-top {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}}
.pkg-code {{
    font-family: var(--font-mono);
    font-size: 10.5px;
    font-weight: 700;
    color: var(--ink-primary);
    background: var(--bg-subtle);
    border: 1px solid var(--border-hairline);
    padding: 1.5px 6px;
    border-radius: 3px;
}}
.pkg-card.crit .pkg-code {{
    background: var(--crit-bg);
    border-color: var(--crit-border);
    color: var(--crit-red);
}}

.pkg-status {{
    font-family: var(--font-mono);
    font-size: 9.5px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 3px;
    letter-spacing: 0.02em;
}}
.st-ok {{ background: var(--ok-bg); color: var(--ok-emerald); border: 1px solid var(--ok-border); }}
.st-replan {{ background: var(--warn-bg); color: var(--warn-amber); border: 1px solid var(--warn-border); }}

.pkg-title {{
    font-size: 12.5px;
    font-weight: 700;
    color: var(--ink-primary);
    margin-bottom: 4px;
    line-height: 1.25;
}}
.pkg-desc {{
    font-size: 11px;
    color: var(--ink-secondary);
    line-height: 1.38;
    margin-bottom: 8px;
}}
.pkg-evid {{
    font-family: var(--font-mono);
    font-size: 9.8px;
    color: var(--ink-muted);
    background: #F8F7F4;
    padding: 3px 6px;
    border-radius: 3px;
    margin-bottom: 6px;
    border-left: 2px solid var(--border-hairline);
}}
.pkg-meta {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--ink-secondary);
    border-top: 1px solid var(--border-hairline);
    padding-top: 5px;
    font-weight: 600;
}}
.delta-pill {{
    color: var(--crit-red);
    font-weight: 800;
}}

.legend-strip {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-surface);
    border: 1px solid var(--border-hairline);
    padding: 8px 16px;
    border-radius: 5px;
    margin-bottom: 14px;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--ink-secondary);
}}
.leg-group {{ display: flex; gap: 22px; align-items: center; }}
.leg-item {{ display: flex; align-items: center; gap: 7px; }}
</style>
</head>
<body>
<div class="canvas-card">
    {build_masthead(
        "01 / 06",
        "Estructura de Desglose del Trabajo (EDT / WBS) y Diccionario Operativo",
        "Descomposición jerárquica auditada en 5 Fases y 15 Paquetes de Trabajo con trazabilidad directa a commits, pruebas y documentos académicos",
        "ESTÁNDAR PMI / WBS 100% RULE",
        "5 Fases · 15 Paquetes · 7 Integrantes"
    )}

    <div class="kpi-ledger">
        <div class="kpi-cell highlight-Finding">
            <div class="kpi-eyebrow"><span>ALCANCE EJECUTADO (REGLA 100%)</span><span class="mono">WBS 1.1–1.5</span></div>
            <div class="kpi-figure lead">15 / 15 <span class="kpi-unit">paquetes completados</span></div>
            <div class="kpi-context">8 paquetes en ruta crítica + 7 paquetes con holgura operativa</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>ESFUERZO EN DÍAS-EQUIPO</span><span class="mono">PLAN VS REAL</span></div>
            <div class="kpi-figure">84d <span class="kpi-unit">vs 69d plan (+15d)</span></div>
            <div class="kpi-context">Desvío absorbido en paralelo por 3 células (45d calendario)</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>PAQUETES REPLANIFICADOS</span><span class="mono">DESVÍO S1–S2</span></div>
            <div class="kpi-figure neg">8 <span class="kpi-unit">paquetes con atraso</span></div>
            <div class="kpi-context">Firebase, Mapa Leaflet, Home BD, Fotos Base64 y Detalle [id]</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>EVIDENCIA EN REPOSITORIO</span><span class="mono">RAMA MAIN</span></div>
            <div class="kpi-figure">114 <span class="kpi-unit">commits en 29 días</span></div>
            <div class="kpi-context">24 Ago al 26 Oct 2026 · 0 errores TypeScript (`tsc --noEmit`)</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>VERIFICACIÓN DE CALIDAD (DoD)</span><span class="mono">SUITE NODE:TEST</span></div>
            <div class="kpi-figure pos">59 / 59 <span class="kpi-unit">tests PASS (100%)</span></div>
            <div class="kpi-context">9 archivos `.test.mjs` + 1 test usabilidad + auditoría WCAG 2.1</div>
        </div>
    </div>

    <div class="legend-strip">
        <div class="leg-group">
            <div class="leg-item"><span style="width:4px; height:14px; background:var(--crit-red); display:inline-block;"></span> <b>Borde Rojo:</b> Paquete en Camino Crítico (HT = 0)</div>
            <div class="leg-item"><span style="width:4px; height:14px; background:var(--ink-secondary); display:inline-block;"></span> <b>Borde Gris Oscuro:</b> Paquete con Holgura (HT &gt; 0)</div>
            <div class="leg-item"><span class="pkg-status st-ok">EN FECHA S1–S2</span> Cerrado según línea base original</div>
            <div class="leg-item"><span class="pkg-status st-replan">REPLANIFICADO → S3</span> Sufrió postergación/refactor y cerró en Sprint 3</div>
        </div>
        <div class="mono" style="font-size:10.5px; color:var(--ink-muted);">PO: Jonatan Rosas · SM: Sol Careaga · QA: Rodrigo Paz</div>
    </div>

    <div class="tree-header-wrap">
        <div class="root-banner">
            <div>
                <div class="r-title">1.0 PROYECTO PATITAS ENCONTRADAS — RED COMUNITARIA DE MASCOTAS (PILAR)</div>
                <div class="r-sub">Célula 1 (Jona, Fran) · Célula 2 (Rodrigo, Maxi) · Célula 3 (Sol, Yerik, Martina) + Bresser (Auth S2)</div>
            </div>
            <div class="r-tag">100% ALCANCE MVP</div>
        </div>
        <!-- Architectural SVG Tree Connector from Root to 5 Columns -->
        <svg width="1596" height="22" style="display:block; margin:0 auto;">
            <line x1="798" y1="0" x2="798" y2="11" stroke="#18181B" stroke-width="2"/>
            <line x1="154" y1="11" x2="1442" y2="11" stroke="#18181B" stroke-width="2"/>
            <line x1="154" y1="11" x2="154" y2="22" stroke="#18181B" stroke-width="2"/>
            <line x1="476" y1="11" x2="476" y2="22" stroke="#18181B" stroke-width="2"/>
            <line x1="798" y1="11" x2="798" y2="22" stroke="#18181B" stroke-width="2"/>
            <line x1="1120" y1="11" x2="1120" y2="22" stroke="#18181B" stroke-width="2"/>
            <line x1="1442" y1="11" x2="1442" y2="22" stroke="#18181B" stroke-width="2"/>
        </svg>
    </div>

    <div class="wbs-grid">
        <!-- COL 1 -->
        <div class="wbs-col">
            <div class="col-header">
                <span class="c-name">1.1 Diagnóstico y Gestión</span>
                <span class="c-code">FASE 1 · 13d</span>
            </div>
            <div class="pkg-card crit">
                <div>
                    <div class="pkg-top">
                        <span class="pkg-code">1.1.1 · ACT-01</span>
                        <span class="pkg-status st-ok">EN FECHA S1</span>
                    </div>
                    <div class="pkg-title">Diagnóstico Territorial y Mapeo Colectivo</div>
                    <div class="pkg-desc">Árbol de problemas en Pilar, matriz de actores, encuesta (29 preguntas) y entrevista institucional (Anexos A y B).</div>
                </div>
                <div>
                    <div class="pkg-evid">Evidencia: Incremento_1_Grupo2.pdf (págs. 1–34)</div>
                    <div class="pkg-meta"><span>Todo el equipo (5 Meets)</span><span>Plan 5d → Real 5d</span></div>
                </div>
            </div>
            <div class="pkg-card crit">
                <div>
                    <div class="pkg-top">
                        <span class="pkg-code">1.1.2 · ACT-02</span>
                        <span class="pkg-status st-ok">EN FECHA S1</span>
                    </div>
                    <div class="pkg-title">SRS (RF-1 a RF-5), MoSCoW y Auditoría IA</div>
                    <div class="pkg-desc">Especificación formal de requerimientos, DFD Nivel 0, Criterios CA1–CA6 y revisión crítica con IA de sesgos y privacidad.</div>
                </div>
                <div>
                    <div class="pkg-evid">Evidencia: Etapa 1 PDF + Reqs corregidos.pdf</div>
                    <div class="pkg-meta"><span>Jona (PO) &amp; Sol (SM)</span><span>Plan 4d → Real 4d</span></div>
                </div>
            </div>
            <div class="pkg-card replan">
                <div>
                    <div class="pkg-top">
                        <span class="pkg-code">1.1.3 · ACT-06</span>
                        <span class="pkg-status st-replan">CERRADO S2 (+1d)</span>
                    </div>
                    <div class="pkg-title">Wireframes Padlet, Test Usabilidad y WCAG</div>
                    <div class="pkg-desc">Bocetos de pantallas, prueba temprana con vecina real (Etapa 2 pág. 9) y auditoría de contraste WCAG 2.1 y 10 heurísticas.</div>
                </div>
                <div>
                    <div class="pkg-evid">Evidencia: Etapa 2 PDF (págs. 1–12)</div>
                    <div class="pkg-meta"><span>Sol, Yerik &amp; Martina</span><span>Plan 3d → <span class="delta-pill">Real 4d</span></span></div>
                </div>
            </div>
        </div>

        <!-- COL 2 -->
        <div class="wbs-col">
            <div class="col-header">
                <span class="c-name">1.2 Infraestructura &amp; Auth</span>
                <span class="c-code">FASE 2 · 18d</span>
            </div>
            <div class="pkg-card crit">
                <div>
                    <div class="pkg-top">
                        <span class="pkg-code">1.2.1 · ACT-03</span>
                        <span class="pkg-status st-ok">EN FECHA S1</span>
                    </div>
                    <div class="pkg-title">Setup Expo SDK 57, Router y Theme Tokens</div>
                    <div class="pkg-desc">Estructura base (24/08), paleta #FF8A00 en constants/theme.ts, fuentes Baloo 2 y Nunito, y arquitectura limpia por capas.</div>
                </div>
                <div>
                    <div class="pkg-evid">Commits: 34d722c (24/08) · fd6e325 (07/09)</div>
                    <div class="pkg-meta"><span>Jona &amp; Sol</span><span>Plan 3d → Real 3d</span></div>
                </div>
            </div>
            <div class="pkg-card crit replan">
                <div>
                    <div class="pkg-top">
                        <span class="pkg-code">1.2.2 · ACT-04</span>
                        <span class="pkg-status st-replan">POSPUESTO S1→S2</span>
                    </div>
                    <div class="pkg-title">Singleton ConexionFirebase y Colecciones</div>
                    <div class="pkg-desc">Se debió quitar Firebase del Sprint 1 el 25/09 para no bloquear la demo; se creó el Singleton y se conectó el 27/09.</div>
                </div>
                <div>
                    <div class="pkg-evid">Commits: 71eb747 · aa88c68 (25/09) · 8549be6 (27/09)</div>
                    <div class="pkg-meta"><span>Jona &amp; Sol</span><span>Plan 4d → <span class="delta-pill">Real 7d (+3d)</span></span></div>
                </div>
            </div>
            <div class="pkg-card crit replan">
                <div>
                    <div class="pkg-top">
                        <span class="pkg-code">1.2.3 · ACT-05</span>
                        <span class="pkg-status st-replan">REPLAN S2→S3</span>
                    </div>
                    <div class="pkg-title">Autenticación Firebase, Zod y AsyncStorage</div>
                    <div class="pkg-desc">UI Login/Registro (09/09 Fran), Auth Firebase (08/10 Bresser/Jona) y fix de sincronización de foto/nombre en Perfil (20/10).</div>
                </div>
                <div>
                    <div class="pkg-evid">Commits: dd02ef8 (09/09) · c7795b7 (08/10) · 20/10</div>
                    <div class="pkg-meta"><span>Jona, Fran &amp; Bresser</span><span>Plan 6d → <span class="delta-pill">Real 8d (+2d)</span></span></div>
                </div>
            </div>
        </div>

        <!-- COL 3 -->
        <div class="wbs-col">
            <div class="col-header">
                <span class="c-name">1.3 Mapa &amp; Geolocalización</span>
                <span class="c-code">FASE 3 · 22d</span>
            </div>
            <div class="pkg-card crit replan">
                <div>
                    <div class="pkg-top">
                        <span class="pkg-code">1.3.1 · ACT-08</span>
                        <span class="pkg-status st-replan">REFACTOR S1</span>
                    </div>
                    <div class="pkg-title">Motor Leaflet 1.9.4 en WebView (Fix Negro)</div>
                    <div class="pkg-desc">El mapa nativo inicial (17/09) daba pantalla negra en Android sin API Key. Refactorizado el 25/09 con OSM/CartoDB y postMessage.</div>
                </div>
                <div>
                    <div class="pkg-evid">Commits: c95cf71 (17/09) → 9f6c8fa (25/09)</div>
                    <div class="pkg-meta"><span>Martina &amp; Jona</span><span>Plan 6d → <span class="delta-pill">Real 8d (+2d)</span></span></div>
                </div>
            </div>
            <div class="pkg-card crit">
                <div>
                    <div class="pkg-top">
                        <span class="pkg-code">1.3.2 · ACT-09</span>
                        <span class="pkg-status st-ok">EN FECHA S2</span>
                    </div>
                    <div class="pkg-title">Hook useMapState, Filtros y GeoValidation</div>
                    <div class="pkg-desc">Desacople en 5 subcomponentes (142 líneas en mapa.tsx &lt;150), GPS expo-location y validación poligonal del Partido de Pilar.</div>
                </div>
                <div>
                    <div class="pkg-evid">Tests: geoValidation.test.mjs (10 tests PASS)</div>
                    <div class="pkg-meta"><span>Jona &amp; Maxi</span><span>Plan 5d → Real 5d</span></div>
                </div>
            </div>
            <div class="pkg-card crit replan">
                <div>
                    <div class="pkg-top">
                        <span class="pkg-code">1.3.3 · ACT-10</span>
                        <span class="pkg-status st-replan">FIX FOTOS S3</span>
                    </div>
                    <div class="pkg-title">Publicar Alerta, Geocoding y Fotos Base64</div>
                    <div class="pkg-desc">Alta de alerta en Firestore (01/10), presets barriales de Pilar y fix crítico el 20/10 por fallo de fetch(uri) en fotos Android.</div>
                </div>
                <div>
                    <div class="pkg-evid">Commits: a985f79 (01/10) · Fix Base64 (20/10)</div>
                    <div class="pkg-meta"><span>Maxi, Jona &amp; Rodrigo</span><span>Plan 7d → <span class="delta-pill">Real 9d (+2d)</span></span></div>
                </div>
            </div>
        </div>

        <!-- COL 4 -->
        <div class="wbs-col">
            <div class="col-header">
                <span class="c-name">1.4 Feed, Detalle &amp; Perfil</span>
                <span class="c-code">FASE 4 · 18d</span>
            </div>
            <div class="pkg-card replan">
                <div>
                    <div class="pkg-top">
                        <span class="pkg-code">1.4.1 · ACT-07</span>
                        <span class="pkg-status st-replan">POSPUESTO S1→S3</span>
                    </div>
                    <div class="pkg-title">Home Feed Conectado a Firestore y Filtros</div>
                    <div class="pkg-desc">Maquetado con mocks en S1 (07–14/09). La conexión real a listarTodasLasAlertas() y pull-to-refresh se pospuso y cerró en S3.</div>
                </div>
                <div>
                    <div class="pkg-evid">Commits: 35383df (19/10) · 18d0d08 (25/10)</div>
                    <div class="pkg-meta"><span>Yerik, Maxi &amp; Rodrigo</span><span>Plan 5d → <span class="delta-pill">Real 7d (+2d)</span></span></div>
                </div>
            </div>
            <div class="pkg-card replan">
                <div>
                    <div class="pkg-top">
                        <span class="pkg-code">1.4.2 · ACT-11</span>
                        <span class="pkg-status st-replan">CERRADO S2–S3</span>
                    </div>
                    <div class="pkg-title">Perfil, Borrado por Autor y "Encontrado"</div>
                    <div class="pkg-desc">Listado por autor y borrado seguro (10/10 Fran), persistencia de avatar (20/10) y botón "Mascota encontrada" con alerta (26/10 Sol).</div>
                </div>
                <div>
                    <div class="pkg-evid">Commits: bdb40ef (10/10) · c0dc788 (26/10)</div>
                    <div class="pkg-meta"><span>Fran, Rodrigo &amp; Sol</span><span>Plan 4d → <span class="delta-pill">Real 5d (+1d)</span></span></div>
                </div>
            </div>
            <div class="pkg-card crit replan">
                <div>
                    <div class="pkg-top">
                        <span class="pkg-code">1.4.3 · ACT-13</span>
                        <span class="pkg-status st-replan">POSPUESTO S2→S3</span>
                    </div>
                    <div class="pkg-title">Ficha Detalle [id], WhatsApp, "Lo Vi" y Share</div>
                    <div class="pkg-desc">Carrusel hero, mapa embebido, deep-link a wa.me con validación telefónica, contador "Lo vi" (Sol) y compartir con link (Yerik).</div>
                </div>
                <div>
                    <div class="pkg-evid">Commits: 902c920 (25/10) · a59be02 · a35d99a (26/10)</div>
                    <div class="pkg-meta"><span>Rodrigo, Jona, Sol, Yerik</span><span>Plan 5d → <span class="delta-pill">Real 6d (+1d)</span></span></div>
                </div>
            </div>
        </div>

        <!-- COL 5 -->
        <div class="wbs-col">
            <div class="col-header">
                <span class="c-name">1.5 Soporte, Guía &amp; QA</span>
                <span class="c-code">FASE 5 · 13d</span>
            </div>
            <div class="pkg-card replan">
                <div>
                    <div class="pkg-top">
                        <span class="pkg-code">1.5.1 · ACT-12</span>
                        <span class="pkg-status st-replan">CERRADO S3</span>
                    </div>
                    <div class="pkg-title">Centro de Soporte: 9 FAQs y Tickets BD</div>
                    <div class="pkg-desc">UI inicial creada en S1 (07–14/09 Sol). En S3 (19/10) se modularizó FaqAccordion.tsx y el envío real a colección tickets_soporte.</div>
                </div>
                <div>
                    <div class="pkg-evid">Tests: faqSection (4) + ticketCollection (3) PASS</div>
                    <div class="pkg-meta"><span>Sol &amp; Jona</span><span>Plan 4d → Real 4d</span></div>
                </div>
            </div>
            <div class="pkg-card replan">
                <div>
                    <div class="pkg-top">
                        <span class="pkg-code">1.5.2 · ACT-14</span>
                        <span class="pkg-status st-replan">CERRADO S2–S3</span>
                    </div>
                    <div class="pkg-title">Guía Interactiva, Ajustes y Bienvenida 3D</div>
                    <div class="pkg-desc">Pantalla Ajustes (01/10 Yerik), GuiaDeUso.tsx en 4 pasos (11/10 Sol) y pantalla de Bienvenida con modo invitado (20/10).</div>
                </div>
                <div>
                    <div class="pkg-evid">Commits: 63a2a31 (01/10) · 256d5be (11/10)</div>
                    <div class="pkg-meta"><span>Sol, Yerik &amp; Jona</span><span>Plan 3d → <span class="delta-pill">Real 4d (+1d)</span></span></div>
                </div>
            </div>
            <div class="pkg-card crit replan">
                <div>
                    <div class="pkg-top">
                        <span class="pkg-code">1.5.3 · ACT-15</span>
                        <span class="pkg-status st-replan">CIERRE 26 OCT</span>
                    </div>
                    <div class="pkg-title">Conciliación de 4 Ramas y Suite 59 Tests</div>
                    <div class="pkg-desc">Resolución de conflictos de merge (home/pantalla, maxi/filtros, rama-rodrigo, dev/equipo1) y 59 tests automatizados en verde.</div>
                </div>
                <div>
                    <div class="pkg-evid">Commits: 3ca6a29 · 749ff35 · 2dd68e8 (26/10)</div>
                    <div class="pkg-meta"><span>Rodrigo (QA) &amp; Jona</span><span>Plan 5d → Real 5d (Día 45)</span></div>
                </div>
            </div>
        </div>
    </div>

    <div class="footer-bar">
        <span>Fuente: Auditoría cruzada del repositorio `JonatanRosassss/Patitas_Encontradas` (114 commits), Incremento 1 (Bitácora), Etapa 1, Etapa 2 y Planificación Sprint 3.</span>
        <span>LÁMINA 01 / 06 · ESTRUCTURA DE DESGLOSE DEL TRABAJO (EDT / WBS)</span>
    </div>
</div>
</body>
</html>
"""

# ==============================================================================
# DIAGRAMA 2: RED DE PRECEDENCIAS (PERT/CPM) Y CAMINO CRITICO
# ==============================================================================
HTML_02_CPM = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
{COMMON_CSS}
body {{ width: 1740px; }}
.kpi-ledger {{ grid-template-columns: 1.1fr 1.15fr 1.45fr 1.15fr 1.15fr; }}

.net-container {{
    position: relative;
    width: 1646px;
    height: 615px;
    background-color: var(--bg-surface);
    background-image: radial-gradient(#E4E0D8 1px, transparent 1px);
    background-size: 14px 14px;
    border: 1.5px solid var(--border-strong);
    border-radius: 6px;
    margin: 0 auto;
    overflow: hidden;
}}

.lane-band {{
    position: absolute;
    left: 0;
    width: 100%;
    border-bottom: 1px dashed var(--border-hairline);
    pointer-events: none;
}}
.lane-tag {{
    position: absolute;
    left: 10px;
    top: 8px;
    font-family: var(--font-mono);
    font-size: 9.5px;
    font-weight: 800;
    color: var(--ink-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: rgba(252,251,249,0.9);
    padding: 2px 6px;
    border: 1px solid var(--border-hairline);
    border-radius: 3px;
}}

.cpm-node {{
    position: absolute;
    width: 202px;
    background: var(--bg-surface);
    border: 1.5px solid var(--plan-blue);
    border-radius: 5px;
    box-shadow: 0 2px 0 rgba(29, 78, 216, 0.18);
    font-size: 11px;
    z-index: 2;
    overflow: hidden;
}}
.cpm-node.crit {{
    border: 2px solid var(--crit-red);
    box-shadow: 0 2px 0 rgba(200, 30, 30, 0.25);
}}
.cpm-row-top, .cpm-row-bot {{
    display: grid;
    grid-template-columns: 1fr 1.25fr 1fr;
    text-align: center;
    font-weight: 700;
    font-family: var(--font-mono);
    font-size: 10px;
}}
.cpm-row-top {{
    background: var(--plan-bg);
    border-bottom: 1px solid var(--plan-border);
    color: var(--plan-blue);
}}
.cpm-node.crit .cpm-row-top {{
    background: var(--crit-bg);
    border-bottom: 1px solid var(--crit-border);
    color: var(--crit-red);
}}
.cpm-row-top > div, .cpm-row-bot > div {{
    padding: 2.5px 4px;
    border-right: 1px solid rgba(0,0,0,0.08);
}}
.cpm-row-top > div:last-child, .cpm-row-bot > div:last-child {{ border-right: none; }}

.cpm-mid {{
    padding: 5px 7px;
    text-align: center;
    background: #FFFFFF;
}}
.cpm-title {{
    font-weight: 700;
    font-size: 11.2px;
    color: var(--ink-primary);
    line-height: 1.2;
}}
.cpm-real {{
    font-family: var(--font-mono);
    font-size: 9.6px;
    margin-top: 3px;
    font-weight: 600;
    color: var(--ink-secondary);
}}
.cpm-real .delay-tag {{
    color: var(--crit-red);
    font-weight: 800;
    background: var(--crit-bg);
    padding: 0 4px;
    border-radius: 2px;
}}
.cpm-row-bot {{
    background: #F8FAFC;
    border-top: 1px solid #E2E8F0;
    color: var(--ink-secondary);
}}
.cpm-node.crit .cpm-row-bot {{
    background: #FFF5F5;
    border-top: 1px solid var(--crit-border);
    color: #7F1D1D;
}}

.legend-box {{
    position: absolute;
    bottom: 12px;
    left: 14px;
    background: var(--bg-surface);
    border: 1.5px solid var(--border-strong);
    border-radius: 5px;
    padding: 8px 14px;
    display: flex;
    gap: 18px;
    align-items: center;
    z-index: 5;
    font-size: 11px;
}}
</style>
</head>
<body>
<div class="canvas-card">
    {build_masthead(
        "02 / 06",
        "Red de Precedencias (AON) y Análisis del Camino Crítico (CPM / PERT)",
        "Cálculo de Pasada Hacia Adelante (ES / EF), Pasada Hacia Atrás (LS / LF), Holgura Total (HT) y Desplazamiento Real de la Ruta Crítica",
        "MÉTODO ACTIVITY-ON-NODE (AON)",
        "15 Nodos · 19 Relaciones FS · 2 Rutas Críticas"
    )}

    <div class="kpi-ledger">
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>LÍNEA BASE CPM PLANIFICADA</span><span class="mono">PASADA ADELANTE</span></div>
            <div class="kpi-figure">40d <span class="kpi-unit">hábiles (EF = 40)</span></div>
            <div class="kpi-context">Secuencia ideal sin postergaciones entre sprints</div>
        </div>
        <div class="kpi-cell highlight-Finding">
            <div class="kpi-eyebrow"><span>DURACIÓN REAL EJECUTADA</span><span class="mono">HALLAZGO CRÍTICO</span></div>
            <div class="kpi-figure neg">45d <span class="kpi-unit">hábiles (+5d vs plan)</span></div>
            <div class="kpi-context">24 Ago al 26 Oct 2026 por atraso S1 y merges S3</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>CAMINO CRÍTICO TEÓRICO (HT = 0)</span><span class="mono">8 NODOS TRONCALES</span></div>
            <div class="kpi-figure" style="font-size:14px; margin:6px 0;">01 → 02 → 03 → 08 → 09 → 10 → 13 → 15</div>
            <div class="kpi-context">Eje Diagnóstico → Mapa Leaflet → Publicar → Detalle → QA</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>RUTA SUB-CRÍTICA EMERGENTE</span><span class="mono">HT: 1d → 0d REAL</span></div>
            <div class="kpi-figure neg" style="font-size:16px; margin:5px 0;">ACT-04 → ACT-05 (+5d)</div>
            <div class="kpi-context">Consumió su holgura (1d) al posponerse Firebase en S1</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>INCERTIDUMBRE DE RUTA (PERT)</span><span class="mono">Σσ² = 7.23</span></div>
            <div class="kpi-figure">σ = 2.69d <span class="kpi-unit">(IC 95%: ±5.27d)</span></div>
            <div class="kpi-context">45d reales cae dentro del límite superior PERT (45.27d)</div>
        </div>
    </div>

    <div class="net-container">
        <!-- Swimlane Bands -->
        <div class="lane-band" style="top:0; height:175px;"><span class="lane-tag" style="left:auto; right:14px;">CARRIL A · GESTIÓN, INFRAESTRUCTURA FIREBASE Y AUTH</span></div>
        <div class="lane-band" style="top:175px; height:180px;"><span class="lane-tag" style="left:280px;">CARRIL B · LEAFLET, UX/WCAG Y ALTA</span></div>
        <div class="lane-band" style="top:355px; height:260px; border-bottom:none;"><span class="lane-tag" style="left:180px;">CARRIL C · HOME, PERFIL, DETALLE [ID] Y QA</span></div>

        <!-- SVG CONNECTORS -->
        <svg width="1646" height="615" style="position:absolute; top:0; left:0; z-index:1;">
            <defs>
                <marker id="arrow-crit" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#C81E1E" />
                </marker>
                <marker id="arrow-norm" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#1D4ED8" />
                </marker>
            </defs>

            <!-- CRITICAL PATH ARROWS (CRIMSON SOLID) -->
            <line x1="222" y1="92" x2="262" y2="92" stroke="#C81E1E" stroke-width="3" marker-end="url(#arrow-crit)" />
            <line x1="464" y1="92" x2="504" y2="92" stroke="#C81E1E" stroke-width="3" marker-end="url(#arrow-crit)" />
            <line x1="706" y1="92" x2="746" y2="92" stroke="#C81E1E" stroke-width="3" marker-end="url(#arrow-crit)" />
            <line x1="948" y1="92" x2="988" y2="92" stroke="#C81E1E" stroke-width="3" marker-end="url(#arrow-crit)" />
            <!-- ACT-03 -> ACT-08 -->
            <path d="M 706 92 L 726 92 L 726 255 L 746 255" fill="none" stroke="#C81E1E" stroke-width="3" marker-end="url(#arrow-crit)" />
            <!-- ACT-08 -> ACT-09 -->
            <line x1="948" y1="255" x2="988" y2="255" stroke="#C81E1E" stroke-width="3" marker-end="url(#arrow-crit)" />
            <!-- ACT-05 -> ACT-10 & ACT-09 -> ACT-10 -->
            <path d="M 1190 92 L 1210 92 L 1210 175 L 1230 175" fill="none" stroke="#C81E1E" stroke-width="3" marker-end="url(#arrow-crit)" />
            <path d="M 1190 255 L 1210 255 L 1210 195 L 1230 195" fill="none" stroke="#C81E1E" stroke-width="3" marker-end="url(#arrow-crit)" />
            <!-- ACT-10 -> ACT-13 -->
            <line x1="1331" y1="238" x2="1331" y2="296" stroke="#C81E1E" stroke-width="3" marker-end="url(#arrow-crit)" />
            <!-- ACT-13 -> ACT-15 -->
            <path d="M 1432 350 L 1515 350 L 1515 438" fill="none" stroke="#C81E1E" stroke-width="3" marker-end="url(#arrow-crit)" />

            <!-- NON-CRITICAL ARROWS (BLUE DASHED - CLEAN CORRIDORS) -->
            <!-- ACT-02 -> ACT-06 -->
            <path d="M 363 144 L 363 166 L 161 166 L 161 200" fill="none" stroke="#1D4ED8" stroke-width="2" stroke-dasharray="5,4" marker-end="url(#arrow-norm)" />
            <!-- ACT-06 -> ACT-14 -->
            <path d="M 161 305 L 161 430 L 504 430" fill="none" stroke="#1D4ED8" stroke-width="2" stroke-dasharray="5,4" marker-end="url(#arrow-norm)" />
            <!-- ACT-04 -> ACT-12 -->
            <path d="M 847 144 L 847 166 L 605 166 L 605 200" fill="none" stroke="#1D4ED8" stroke-width="2" stroke-dasharray="5,4" marker-end="url(#arrow-norm)" />
            <!-- ACT-05 -> ACT-07 (corridor x=720) -->
            <path d="M 1089 144 L 1089 182 L 720 182 L 720 430 L 746 430" fill="none" stroke="#1D4ED8" stroke-width="2" stroke-dasharray="5,4" marker-end="url(#arrow-norm)" />
            <!-- ACT-10 -> ACT-11 (corridor x=1208) -->
            <path d="M 1230 220 L 1208 220 L 1208 352 L 1089 352 L 1089 376" fill="none" stroke="#1D4ED8" stroke-width="2" stroke-dasharray="5,4" marker-end="url(#arrow-norm)" />
            <!-- ACT-07 -> ACT-13 (corridor y=340) -->
            <path d="M 948 415 L 968 415 L 968 340 L 1230 340" fill="none" stroke="#1D4ED8" stroke-width="2" stroke-dasharray="5,4" marker-end="url(#arrow-norm)" />
            <!-- ACT-12 -> ACT-15 -->
            <path d="M 504 255 L 480 255 L 480 532 L 1412 532" fill="none" stroke="#1D4ED8" stroke-width="2" stroke-dasharray="5,4" marker-end="url(#arrow-norm)" />
            <!-- ACT-14 -> ACT-15 -->
            <path d="M 605 482 L 605 512 L 1412 512" fill="none" stroke="#1D4ED8" stroke-width="2" stroke-dasharray="5,4" marker-end="url(#arrow-norm)" />
            <!-- ACT-11 -> ACT-15 -->
            <path d="M 1190 430 L 1300 430 L 1300 492 L 1412 492" fill="none" stroke="#1D4ED8" stroke-width="2" stroke-dasharray="5,4" marker-end="url(#arrow-norm)" />
        </svg>

        <!-- ROW 1: CRITICAL CORE -->
        <div class="cpm-node crit" style="left:20px; top:40px;">
            <div class="cpm-row-top"><div>ES: 0</div><div>ACT-01</div><div>EF: 5</div></div>
            <div class="cpm-mid">
                <div class="cpm-title">Diagnóstico y Relevamiento</div>
                <div class="cpm-real">Plan: 5d | Real: 5d (24–30 Ago)</div>
            </div>
            <div class="cpm-row-bot"><div>LS: 0</div><div>HT: 0d</div><div>LF: 5</div></div>
        </div>

        <div class="cpm-node crit" style="left:262px; top:40px;">
            <div class="cpm-row-top"><div>ES: 5</div><div>ACT-02</div><div>EF: 9</div></div>
            <div class="cpm-mid">
                <div class="cpm-title">SRS, MoSCoW y Revisión IA</div>
                <div class="cpm-real">Plan: 4d | Real: 4d (31 Ago–4 Sep)</div>
            </div>
            <div class="cpm-row-bot"><div>LS: 5</div><div>HT: 0d</div><div>LF: 9</div></div>
        </div>

        <div class="cpm-node crit" style="left:504px; top:40px;">
            <div class="cpm-row-top"><div>ES: 9</div><div>ACT-03</div><div>EF: 12</div></div>
            <div class="cpm-mid">
                <div class="cpm-title">Setup Expo 57 &amp; Theme</div>
                <div class="cpm-real">Plan: 3d | Real: 3d (7–9 Sep)</div>
            </div>
            <div class="cpm-row-bot"><div>LS: 9</div><div>HT: 0d</div><div>LF: 12</div></div>
        </div>

        <div class="cpm-node crit" style="left:746px; top:40px;">
            <div class="cpm-row-top"><div>ES: 12</div><div>ACT-04</div><div>EF: 16</div></div>
            <div class="cpm-mid">
                <div class="cpm-title">Singleton ConexionFirebase</div>
                <div class="cpm-real">Plan: 4d | <span class="delay-tag">Real: 7d (Posp. S1)</span></div>
            </div>
            <div class="cpm-row-bot"><div>LS: 13</div><div>HT: 1d→0d*</div><div>LF: 17</div></div>
        </div>

        <div class="cpm-node crit" style="left:988px; top:40px;">
            <div class="cpm-row-top"><div>ES: 16</div><div>ACT-05</div><div>EF: 22</div></div>
            <div class="cpm-mid">
                <div class="cpm-title">Auth Firebase &amp; AsyncStorage</div>
                <div class="cpm-real">Plan: 6d | <span class="delay-tag">Real: 8d (Fix 20/10)</span></div>
            </div>
            <div class="cpm-row-bot"><div>LS: 17</div><div>HT: 1d→0d*</div><div>LF: 23</div></div>
        </div>

        <!-- ROW 2: UX, SUPPORT & MAP -->
        <div class="cpm-node" style="left:60px; top:202px;">
            <div class="cpm-row-top"><div>ES: 9</div><div>ACT-06</div><div>EF: 12</div></div>
            <div class="cpm-mid">
                <div class="cpm-title">Wireframes Padlet &amp; WCAG</div>
                <div class="cpm-real">Plan: 3d | Real: 4d (Etapa 2)</div>
            </div>
            <div class="cpm-row-bot"><div>LS: 19</div><div>HT: +10d</div><div>LF: 22</div></div>
        </div>

        <div class="cpm-node" style="left:504px; top:202px;">
            <div class="cpm-row-top"><div>ES: 16</div><div>ACT-12</div><div>EF: 20</div></div>
            <div class="cpm-mid">
                <div class="cpm-title">Soporte: 9 FAQs y Tickets</div>
                <div class="cpm-real">Plan: 4d | <span class="delay-tag">Cerrado S3 (19/10)</span></div>
            </div>
            <div class="cpm-row-bot"><div>LS: 31</div><div>HT: +15d</div><div>LF: 35</div></div>
        </div>

        <div class="cpm-node crit" style="left:746px; top:202px;">
            <div class="cpm-row-top"><div>ES: 12</div><div>ACT-08</div><div>EF: 18</div></div>
            <div class="cpm-mid">
                <div class="cpm-title">Motor Leaflet / WebView</div>
                <div class="cpm-real">Plan: 6d | <span class="delay-tag">Real: 8d (Refactor)</span></div>
            </div>
            <div class="cpm-row-bot"><div>LS: 12</div><div>HT: 0d</div><div>LF: 18</div></div>
        </div>

        <div class="cpm-node crit" style="left:988px; top:202px;">
            <div class="cpm-row-top"><div>ES: 18</div><div>ACT-09</div><div>EF: 23</div></div>
            <div class="cpm-mid">
                <div class="cpm-title">useMapState &amp; GeoValidation</div>
                <div class="cpm-real">Plan: 5d | Real: 5d (25–30 Sep)</div>
            </div>
            <div class="cpm-row-bot"><div>LS: 18</div><div>HT: 0d</div><div>LF: 23</div></div>
        </div>

        <div class="cpm-node crit" style="left:1230px; top:135px;">
            <div class="cpm-row-top"><div>ES: 23</div><div>ACT-10</div><div>EF: 30</div></div>
            <div class="cpm-mid">
                <div class="cpm-title">Publicar Alerta + Fotos</div>
                <div class="cpm-real">Plan: 7d | <span class="delay-tag">Real: 9d (Fix Base64)</span></div>
            </div>
            <div class="cpm-row-bot"><div>LS: 23</div><div>HT: 0d</div><div>LF: 30</div></div>
        </div>

        <!-- ROW 3: ONBOARDING, HOME, PERFIL, DETALLE, QA -->
        <div class="cpm-node" style="left:504px; top:378px;">
            <div class="cpm-row-top"><div>ES: 12</div><div>ACT-14</div><div>EF: 15</div></div>
            <div class="cpm-mid">
                <div class="cpm-title">Guía de Uso, Ajustes &amp; Hero</div>
                <div class="cpm-real">Plan: 3d | Real: 4d (01–20 Oct)</div>
            </div>
            <div class="cpm-row-bot"><div>LS: 32</div><div>HT: +20d</div><div>LF: 35</div></div>
        </div>

        <div class="cpm-node" style="left:746px; top:378px;">
            <div class="cpm-row-top"><div>ES: 22</div><div>ACT-07</div><div>EF: 27</div></div>
            <div class="cpm-mid">
                <div class="cpm-title">Feed Home en Vivo + Filtros</div>
                <div class="cpm-real">Plan: 5d | <span class="delay-tag">Pospuesto a S3</span></div>
            </div>
            <div class="cpm-row-bot"><div>LS: 25</div><div>HT: +3d</div><div>LF: 30</div></div>
        </div>

        <div class="cpm-node" style="left:988px; top:378px;">
            <div class="cpm-row-top"><div>ES: 30</div><div>ACT-11</div><div>EF: 34</div></div>
            <div class="cpm-mid">
                <div class="cpm-title">Perfil, Borrado &amp; "Encontrado"</div>
                <div class="cpm-real">Plan: 4d | Real: 5d (10–26 Oct)</div>
            </div>
            <div class="cpm-row-bot"><div>LS: 31</div><div>HT: +1d</div><div>LF: 35</div></div>
        </div>

        <div class="cpm-node crit" style="left:1230px; top:298px;">
            <div class="cpm-row-top"><div>ES: 30</div><div>ACT-13</div><div>EF: 35</div></div>
            <div class="cpm-mid">
                <div class="cpm-title">Detalle [id] + WhatsApp + Lo Vi</div>
                <div class="cpm-real">Plan: 5d | <span class="delay-tag">Real: 6d (Sprint 3)</span></div>
            </div>
            <div class="cpm-row-bot"><div>LS: 30</div><div>HT: 0d</div><div>LF: 35</div></div>
        </div>

        <div class="cpm-node crit" style="left:1414px; top:440px;">
            <div class="cpm-row-top"><div>ES: 35</div><div>ACT-15</div><div>EF: 40</div></div>
            <div class="cpm-mid">
                <div class="cpm-title">Merges Git + 59 Tests QA</div>
                <div class="cpm-real">Plan: 5d | <span class="delay-tag">Fin Real: Día 45</span></div>
            </div>
            <div class="cpm-row-bot"><div>LS: 35</div><div>HT: 0d</div><div>LF: 40</div></div>
        </div>

        <!-- LEGEND -->
        <div class="legend-box">
            <div class="mono" style="font-weight:800; color:var(--ink-primary);">ESTRUCTURA DE NODO CPM:</div>
            <div><span class="mono" style="background:var(--crit-bg); color:var(--crit-red); border:1px solid var(--crit-border); padding:2px 6px; border-radius:3px; font-weight:700;">ES | ID | EF</span> Inicio / Fin Temprano</div>
            <div><span class="mono" style="background:#F8FAFC; color:var(--ink-secondary); border:1px solid #CBD5E1; padding:2px 6px; border-radius:3px; font-weight:700;">LS | HT | LF</span> Inicio / Fin Tardío y Holgura</div>
            <div style="display:flex; align-items:center; gap:6px;"><span style="width:24px; height:3.5px; background:#C81E1E; display:inline-block;"></span> <b>Ruta Crítica (HT = 0d)</b></div>
            <div style="display:flex; align-items:center; gap:6px;"><span style="width:24px; height:2px; border-bottom:2px dashed #1D4ED8; display:inline-block;"></span> <b>Ruta con Holgura</b> (*ACT-04 y 05 consumieron su HT=1d al posponerse Firebase)</div>
        </div>
    </div>

    <div class="footer-bar">
        <span>Fórmulas CPM verificadas: EF = ES + Duración · LS = LF - Duración · Holgura Total (HT) = LS - ES = LF - EF. Desfase real acumulado: +5 días hábiles.</span>
        <span>LÁMINA 02 / 06 · RED DE PRECEDENCIAS (AON) Y CAMINO CRÍTICO</span>
    </div>
</div>
</body>
</html>
"""

# ==============================================================================
# DIAGRAMA 3: CRONOGRAMA GANTT COMPARATIVO (PLANIFICADO VS REAL CON ATRASOS)
# ==============================================================================
gantt_tasks = [
    ("ACT-01", "Diagnóstico y Mapeo Colectivo (Inc. 1)", "Todo el equipo (5 Meets)", "5d / 5d", 1, 1, 2, 1, 2, "CRIT", "Encuesta (29 preg.) + Entrevista (Anexos A-B)"),
    ("ACT-02", "SRS (RF1-RF5), MoSCoW y Revisión IA", "Jona (PO), Sol (SM)", "4d / 4d", 2, 2, 3, 2, 3, "CRIT", "Etapa 1 + Reqs corregidos + DFD Nivel 0"),
    ("ACT-03", "Setup Expo 57, Router y Theme Tokens", "Jona, Sol", "3d / 3d", 1, 1, 3, 1, 3, "CRIT", "Commits 24/08 (34d722c) al 07/09 (fd6e325)"),
    ("ACT-06", "Wireframes Padlet, Usabilidad y WCAG", "Sol, Yerik, Martina", "3d / 4d", 3, 4, 6, 4, 7, "NORM", "Etapa 2 + 1 test usuario real + Nielsen/WCAG"),
    ("ACT-04", "Singleton ConexionFirebase y Firestore", "Jona, Sol, Rodrigo", "4d / 7d", 3, 5, 5, 5, 6, "DELAY", "25/09 pospuesto S1 (71eb747) → 27/09 conectado"),
    ("ACT-08", "Mapa Leaflet/WebView (Fix Pantalla Negra)", "Martina, Jona", "6d / 8d", 4, 5, 5, 5, 6, "DELAY", "17/09 Mapa v1 negro → 25/09 Refactor OSM"),
    ("ACT-05", "Auth Firebase, Zod y AsyncStorage", "Jona, Fran, Bresser", "6d / 8d", 3, 5, 7, 3, 9, "DELAY", "09/09 UI → 08/10 Auth BD → 20/10 Fix Perfil"),
    ("ACT-09", "Hook useMapState, GPS y geoValidation", "Jona, Maxi", "5d / 5d", 5, 6, 7, 6, 7, "CRIT", "142 líneas (<150) + 10 tests geoValidation PASS"),
    ("ACT-10", "Publicar Alerta, Geocoding y Base64", "Maxi, Jona, Rodrigo", "7d / 9d", 6, 7, 8, 6, 9, "DELAY", "01/10 Alta Alerta → 20/10 Fix fotos Android"),
    ("ACT-07", "Home Feed en Vivo y Filtros Combinados", "Yerik, Maxi, Rodrigo", "5d / 7d", 3, 5, 8, 3, 10, "DELAY", "07/09 UI Mocks → Pospuesto a S3 (19–25 Oct)"),
    ("ACT-11", "Perfil, Borrado por Autor y 'Encontrado'", "Fran, Rodrigo, Sol", "4d / 5d", 6, 7, 8, 6, 10, "DELAY", "30/09 Perfil → 10/10 Borrado → 26/10 Sol"),
    ("ACT-12", "Centro de Soporte: 9 FAQs y Tickets BD", "Sol, Jona", "4d / 4d", 3, 6, 7, 3, 9, "DELAY", "07/09 UI Soporte → 19/10 Colección tickets BD"),
    ("ACT-14", "Ajustes, Guía Interactiva y Bienvenida 3D", "Yerik, Sol, Jona", "3d / 4d", 6, 7, 8, 6, 9, "NORM", "01/10 Ajustes · 11/10 Guía · 20/10 Bienvenida"),
    ("ACT-13", "Ficha Detalle [id], WhatsApp y 'Lo Vi'", "Rodrigo, Jona, Sol, Yerik", "5d / 6d", 7, 8, 9, 9, 10, "DELAY", "Pospuesto de S2 a S3 (20–26 Oct: Wpp+LoVi+Share)"),
    ("ACT-15", "Merges de 4 Ramas y Suite de 59 Tests QA", "Rodrigo (QA), Jona", "5d / 5d", 9, 9, 10, 10, 11, "CRIT", "26/10: 4 Merges + 59 tests PASS + Cierre Final"),
]

gantt_rows_html = ""
for code, name, owner, dur_str, p_start_s1, p_s, p_e, r_s, r_e, kind, note in gantt_tasks:
    cells_html = ""
    for w in range(1, 12):
        in_plan = (p_s <= w <= p_e)
        in_real = (r_s <= w <= r_e)
        is_early_ui = (w == p_start_s1 and p_start_s1 < p_s)
        bar_html = '<div class="cell-bars">'
        if in_plan:
            bar_html += '<div class="bar-plan"></div>'
        else:
            bar_html += '<div class="bar-spacer"></div>'

        if in_real and not (p_start_s1 < p_s and w < p_s and w != p_start_s1):
            if kind == "DELAY" and w > p_e:
                bar_html += '<div class="bar-real-delay"></div>'
            elif kind == "CRIT":
                bar_html += '<div class="bar-real-crit"></div>'
            else:
                bar_html += '<div class="bar-real-ok"></div>'
        elif is_early_ui:
            bar_html += '<div class="bar-early"></div>'
        else:
            bar_html += '<div class="bar-spacer-real"></div>'
        bar_html += '</div>'
        wk_bg = " style='background:#FFF9F2;'" if w in (5, 9, 10) else ""
        cells_html += f'<td class="wk-cell"{wk_bg}>{bar_html}</td>'

    badge_cls = "b-crit" if kind == "CRIT" else ("b-delay" if kind == "DELAY" else "b-norm")
    badge_txt = "CRÍTICA" if kind == "CRIT" else ("REPLAN S3" if kind == "DELAY" else "HOLGURA")
    gantt_rows_html += f"""
    <tr>
        <td class="col-code mono"><b>{code}</b><span class="badge {badge_cls}">{badge_txt}</span></td>
        <td class="col-name"><b>{name}</b><div class="sub-owner">{owner}</div></td>
        <td class="col-dur mono">{dur_str}</td>
        {cells_html}
        <td class="col-note">{note}</td>
    </tr>
    """

# Milestone row at bottom of Gantt table
milestones_by_week = {
    1: ("H1", "24/08 Init Repo"),
    3: ("H2", "07/09 UI Base"),
    4: ("H3", "14/09 Demo S1"),
    5: ("H4", "25/09 Leaflet+FB"),
    6: ("H5", "01/10 Alta Alerta"),
    7: ("H6", "08/10 Auth BD"),
    9: ("H7", "19/10 3 Células"),
    10: ("H8", "26/10 59 Tests"),
    11: ("H9", "Defensa Final"),
}
milestone_cells_html = ""
for w in range(1, 12):
    if w in milestones_by_week:
        m_id, m_lbl = milestones_by_week[w]
        milestone_cells_html += f"""
        <td class="wk-cell" style="background:#18181B; color:#FFF; text-align:center; padding:4px 2px !important;">
            <div class="mono" style="font-size:9.5px; font-weight:800; color:#FDBA74;">◆ {m_id}</div>
            <div style="font-size:8.5px; color:#E4E4E7; line-height:1.15;">{m_lbl}</div>
        </td>
        """
    else:
        milestone_cells_html += '<td class="wk-cell" style="background:#18181B; text-align:center; color:#52525B;">—</td>'

HTML_03_GANTT = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
{COMMON_CSS}
body {{ width: 1760px; }}
.kpi-ledger {{ grid-template-columns: repeat(5, 1fr); }}

/* Taste-skill §7: Tables are rules and alignment. Each booking kind has its own mark */
table.gantt-table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
    background: var(--bg-surface);
    border: 1.5px solid var(--border-strong);
}}
table.gantt-table th {{
    background: var(--ink-primary);
    color: #FFFFFF;
    padding: 7px 6px;
    border: 1px solid #3F3F46;
    font-weight: 700;
    text-align: center;
    font-size: 10.5px;
}}
table.gantt-table td {{
    border-bottom: 1px solid var(--border-hairline);
    border-right: 1px solid var(--border-hairline);
    padding: 5px 7px;
    vertical-align: middle;
}}
.col-code {{ width: 88px; text-align: center; }}
.col-name {{ width: 265px; }}
.col-dur {{ width: 64px; text-align: right; font-weight: 700; font-size: 10.5px; color: var(--ink-secondary); }}
.sub-owner {{ font-size: 10px; color: var(--ink-muted); margin-top: 1px; font-weight: 500; }}
.col-note {{ width: 250px; font-size: 10.2px; color: var(--ink-secondary); font-family: var(--font-mono); }}
.wk-cell {{ width: 76px; padding: 4px 5px !important; vertical-align: middle; height: 38px; }}

.cell-bars {{
    display: flex;
    flex-direction: column;
    gap: 3px;
}}
.bar-spacer {{ height: 6px; }}
.bar-spacer-real {{ height: 11px; }}

/* Mark 1: Planned Baseline (Blueprint hollow bar with blue border) */
.bar-plan {{
    height: 6px;
    background: #DBEAFE;
    border: 1.2px solid #1D4ED8;
    border-radius: 2px;
}}
/* Mark 2: Real Executed on Schedule / Non-critical (Solid Emerald) */
.bar-real-ok {{
    height: 11px;
    background: #047857;
    border-radius: 2px;
}}
/* Mark 3: Real Executed on Critical Path (Solid Crimson) */
.bar-real-crit {{
    height: 11px;
    background: #C81E1E;
    border-radius: 2px;
}}
/* Mark 4: Postponed / Replanned Spillover (Diagonal Hatch Amber/Crimson) */
.bar-real-delay {{
    height: 11px;
    background: repeating-linear-gradient(
        -45deg,
        #FEF3C7,
        #FEF3C7 4px,
        #D97706 4px,
        #D97706 8px
    );
    border: 1px solid #B45309;
    border-radius: 2px;
}}
/* Mark 5: Early UI Mockup in Sprint 1 (Dashed Violet) */
.bar-early {{
    height: 10px;
    background: #F3E8FF;
    border: 1.2px dashed #6D28D9;
    border-radius: 2px;
}}

.badge {{
    display: block;
    font-size: 8.5px;
    padding: 1px 4px;
    border-radius: 2px;
    font-weight: 800;
    margin-top: 2px;
}}
.b-crit {{ background: var(--crit-bg); color: var(--crit-red); border: 1px solid var(--crit-border); }}
.b-delay {{ background: var(--warn-bg); color: var(--warn-amber); border: 1px solid var(--warn-border); }}
.b-norm {{ background: var(--plan-bg); color: var(--plan-blue); border: 1px solid var(--plan-border); }}

.legend-bar {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 11px;
    font-weight: 600;
    background: var(--bg-surface);
    padding: 8px 14px;
    border-radius: 5px;
    border: 1px solid var(--border-hairline);
}}
.leg-items {{ display: flex; gap: 18px; align-items: center; }}
.leg-box {{ display: flex; align-items: center; gap: 6px; }}
</style>
</head>
<body>
<div class="canvas-card">
    {build_masthead(
        "03 / 06",
        "Cronograma Gantt Comparativo: Línea Base Planificada vs. Ejecución Real en Git",
        "Mapeo a las 11 semanas reales del Cuatrimestre 2026-2 (24 Ago – 06 Nov 2026), codificando visualmente cada postergación y su cierre en el Sprint 3",
        "CALENDARIO REAL CUATRIMESTRE 2026-2",
        "11 Semanas · 3 Sprints · 9 Hitos (H1–H9)"
    )}

    <div class="kpi-ledger">
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>SPRINT 1 (SEM 1 A 5)</span><span class="mono">24 AGO – 27 SEP</span></div>
            <div class="kpi-figure">43 <span class="kpi-unit">commits (UI + Mapa)</span></div>
            <div class="kpi-context">Se pospuso Firebase (25/09) y se refactorizó Mapa a Leaflet</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>SPRINT 2 (SEM 6 A 8)</span><span class="mono">28 SEP – 18 OCT</span></div>
            <div class="kpi-figure">37 <span class="kpi-unit">commits (BD + Auth)</span></div>
            <div class="kpi-context">Firestore + Auth + Publicar listos; Home BD y Detalle pospuestos</div>
        </div>
        <div class="kpi-cell highlight-Finding">
            <div class="kpi-eyebrow"><span>SPRINT 3 (SEM 9 A 10)</span><span class="mono">19 OCT – 26 OCT</span></div>
            <div class="kpi-figure lead">34 <span class="kpi-unit">commits (3 Células)</span></div>
            <div class="kpi-context">Cierre de las 10 tareas en 7 días + 4 merges + 59 tests PASS</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>TAREAS REPLANIFICADAS</span><span class="mono">ARRASTRE ENTRE SPRINTS</span></div>
            <div class="kpi-figure neg">8 / 15 <span class="kpi-unit">actividades</span></div>
            <div class="kpi-context">Codificadas con trama diagonal ámbar en las semanas de extensión</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>COLCHÓN PRE-ENTREGA</span><span class="mono">SEM 11 (02–06 NOV)</span></div>
            <div class="kpi-figure pos">+5d <span class="kpi-unit">margen de defensa</span></div>
            <div class="kpi-context">Código congelado el 26/10 con suite QA 100% en verde</div>
        </div>
    </div>

    <div class="legend-bar">
        <div class="leg-items">
            <div class="leg-box"><span class="bar-plan" style="width:22px; display:inline-block;"></span> <b>Planificado (Barra Superior)</b></div>
            <div class="leg-box"><span class="bar-real-crit" style="width:22px; display:inline-block;"></span> <b>Real en Ruta Crítica</b></div>
            <div class="leg-box"><span class="bar-real-ok" style="width:22px; display:inline-block;"></span> <b>Real en Fecha / Holgura</b></div>
            <div class="leg-box"><span class="bar-real-delay" style="width:22px; display:inline-block;"></span> <b>Extensión por Tarea Pospuesta / Refactor</b></div>
            <div class="leg-box"><span class="bar-early" style="width:22px; display:inline-block;"></span> <b>Maquetado UI Temprano (Mocks S1)</b></div>
        </div>
        <div class="mono" style="font-size:10px; color:var(--ink-muted);">Columnas resaltadas: Sem 5 (Crisis Mapa/FB) · Sem 9–10 (Células Sprint 3)</div>
    </div>

    <table class="gantt-table">
        <thead>
            <tr>
                <th rowspan="2">ID / Estado</th>
                <th rowspan="2">Actividad y Responsables Reales</th>
                <th rowspan="2">Plan / Real</th>
                <th colspan="5" style="background:#1E3A8A;">SPRINT 1 · Diagnóstico, Maquetado UI y Refactor Leaflet</th>
                <th colspan="3" style="background:#065F46;">SPRINT 2 · Singleton Firebase, Auth y Alta</th>
                <th colspan="3" style="background:#9A3412;">SPRINT 3 · 3 Células (2+2+3), QA y Cierre</th>
                <th rowspan="2">Evidencia en Git y Auditoría de Desvíos</th>
            </tr>
            <tr>
                <th>Sem 1<br><span style="font-size:9px; font-weight:400; color:#D4D4D8;">24–30 Ago</span></th>
                <th>Sem 2<br><span style="font-size:9px; font-weight:400; color:#D4D4D8;">31 Ago–6 Sep</span></th>
                <th>Sem 3<br><span style="font-size:9px; font-weight:400; color:#D4D4D8;">07–13 Sep</span></th>
                <th>Sem 4<br><span style="font-size:9px; font-weight:400; color:#D4D4D8;">14–20 Sep</span></th>
                <th style="background:#7F1D1D;">Sem 5*<br><span style="font-size:9px; font-weight:400; color:#FCA5A5;">21–27 Sep</span></th>
                <th>Sem 6<br><span style="font-size:9px; font-weight:400; color:#D4D4D8;">28 Sep–4 Oct</span></th>
                <th>Sem 7<br><span style="font-size:9px; font-weight:400; color:#D4D4D8;">05–11 Oct</span></th>
                <th>Sem 8<br><span style="font-size:9px; font-weight:400; color:#D4D4D8;">12–18 Oct</span></th>
                <th style="background:#7C2D12;">Sem 9*<br><span style="font-size:9px; font-weight:400; color:#FDBA74;">19–25 Oct</span></th>
                <th style="background:#7C2D12;">Sem 10*<br><span style="font-size:9px; font-weight:400; color:#FDBA74;">26 Oct–1 Nov</span></th>
                <th>Sem 11<br><span style="font-size:9px; font-weight:400; color:#D4D4D8;">02–06 Nov</span></th>
            </tr>
        </thead>
        <tbody>
            {gantt_rows_html}
            <tr>
                <td class="col-code mono" style="background:#18181B; color:#FDBA74; font-weight:800;">HITOS</td>
                <td class="col-name" style="background:#18181B; color:#FFF; font-weight:700;">Línea de Hitos Verificados (H1 a H9)</td>
                <td class="col-dur mono" style="background:#18181B; color:#D4D4D8;">9 Hitos</td>
                {milestone_cells_html}
                <td class="col-note" style="background:#18181B; color:#E4E4E7;">Trazabilidad 100% verificada en `git log`</td>
            </tr>
        </tbody>
    </table>

    <div class="footer-bar">
        <span>Lectura de barras: En cada celda semanal, la barra delgada superior indica la ventana planificada y la barra inferior muestra la ejecución real (o su extensión con trama diagonal).</span>
        <span>LÁMINA 03 / 06 · CRONOGRAMA GANTT COMPARATIVO (PLANIFICADO VS. REAL)</span>
    </div>
</div>
</body>
</html>
"""

# ==============================================================================
# DIAGRAMA 4: DIAGRAMA DE PUNTOS E INTERVALOS PERT (ESTIMACION VS REALIDAD)
# ==============================================================================
pert_data = [
    ("ACT-01", "Diagnóstico Territorial", 3, 5, 5.17, 8, 5.0, 0.69, "En fecha (5 Meets)"),
    ("ACT-02", "SRS y Revisión Crítica IA", 2, 4, 4.17, 7, 4.0, 0.69, "En fecha (Etapa 1)"),
    ("ACT-03", "Setup Expo 57 y Tokens", 2, 3, 3.17, 5, 3.0, 0.25, "En fecha (24/08–07/09)"),
    ("ACT-04", "Singleton Firebase (Posp. S1)", 2, 4, 4.17, 7, 7.0, 0.69, "Pospuesto en S1 (+2.83d)"),
    ("ACT-05", "Auth Firebase + AsyncStorage", 4, 6, 6.33, 10, 8.0, 1.00, "Fix sincronización (+1.67d)"),
    ("ACT-06", "Wireframes Padlet y WCAG", 2, 3, 3.17, 5, 4.0, 0.25, "Auditoría WCAG (+0.83d)"),
    ("ACT-07", "Home Feed BD (Posp. a S3)", 3, 5, 5.33, 9, 7.0, 1.00, "Cerrado en S3 (+1.67d)"),
    ("ACT-08", "Motor Leaflet (Fix Mapa Negro)", 4, 6, 6.50, 11, 8.0, 1.36, "Refactor WebView (+1.50d)"),
    ("ACT-09", "Hook useMapState + GeoVal", 3, 5, 5.17, 8, 5.0, 0.69, "En fecha (10 tests geo)"),
    ("ACT-10", "Publicar Alerta + Fix Base64", 4, 7, 7.33, 12, 9.0, 1.78, "Fix fotos Android (+1.67d)"),
    ("ACT-11", "Perfil, Borrado y 'Encontrado'", 3, 4, 4.33, 7, 5.0, 0.44, "Botón Sol S3 (+0.67d)"),
    ("ACT-12", "Soporte: 9 FAQs y Tickets BD", 2, 4, 4.00, 6, 4.0, 0.44, "Exacto a media PERT"),
    ("ACT-13", "Detalle [id] + WhatsApp (S3)", 3, 5, 5.33, 9, 6.0, 1.00, "Cerrado en S3 (+0.67d)"),
    ("ACT-14", "Guía de Uso, Ajustes y Hero", 2, 3, 3.33, 6, 4.0, 0.44, "Hero 3D en S3 (+0.67d)"),
    ("ACT-15", "Merges Git + 59 Tests QA", 3, 5, 5.17, 8, 5.0, 0.69, "4 Merges + 59 tests PASS"),
]

svg_pert_rows = ""
for idx, (code, label, a, m, mu, b, real, var, cause) in enumerate(pert_data):
    y = 38 + idx * 36
    def dx(val):
        return 255 + val * 47.0

    xa, xm, xmu, xb, xreal = dx(a), dx(m), dx(mu), dx(b), dx(real)
    row_bg = "#F7F5F0" if idx % 2 == 0 else "#FFFFFF"
    diff = real - mu
    diff_str = f"+{diff:.2f}d" if diff > 0.05 else f"{diff:.2f}d"
    diff_col = "#C81E1E" if diff > 1.0 else ("#B45309" if diff > 0.2 else "#047857")

    # Highlight bar between expected mu and real when delayed
    drift_bar = ""
    if real > mu + 0.1:
        drift_bar = f'<line x1="{xmu}" y1="{y}" x2="{xreal}" y2="{y}" stroke="#FCA5A5" stroke-width="9" opacity="0.65" />'

    svg_pert_rows += f"""
    <rect x="8" y="{y-17}" width="985" height="33" fill="{row_bg}" rx="3" />
    <text x="18" y="{y+4}" font-size="11" font-weight="700" fill="#18181B" font-family="JetBrains Mono">{code}</text>
    <text x="76" y="{y+4}" font-size="11.2" font-weight="600" fill="#27272A">{label}</text>
    <!-- Whisker line [a, b] -->
    <line x1="{xa}" y1="{y}" x2="{xb}" y2="{y}" stroke="#D4D4D8" stroke-width="4" stroke-linecap="round" />
    {drift_bar}
    <!-- Optimistic (a) -->
    <circle cx="{xa}" cy="{y}" r="5.5" fill="#047857" stroke="#FFF" stroke-width="1.5" />
    <!-- Most Probable (m) -->
    <circle cx="{xm}" cy="{y}" r="5.5" fill="#1D4ED8" stroke="#FFF" stroke-width="1.5" />
    <!-- Expected PERT (mu) -->
    <polygon points="{xmu},{y-7.5} {xmu+6.5},{y} {xmu},{y+7.5} {xmu-6.5},{y}" fill="#6D28D9" stroke="#FFF" stroke-width="1.2" />
    <!-- Pessimistic (b) -->
    <circle cx="{xb}" cy="{y}" r="5.5" fill="#71717A" stroke="#FFF" stroke-width="1.5" />
    <!-- REAL EXECUTED (Double Bullseye Ring) -->
    <circle cx="{xreal}" cy="{y}" r="8" fill="none" stroke="#C81E1E" stroke-width="2.4" />
    <circle cx="{xreal}" cy="{y}" r="3.2" fill="#C81E1E" />
    <!-- Right side tabular metrics -->
    <text x="885" y="{y+4}" font-size="10.8" font-weight="700" fill="#3F3F46" font-family="JetBrains Mono">μ={mu:.2f}d</text>
    <text x="982" y="{y+4}" font-size="10.8" font-weight="800" fill="{diff_col}" text-anchor="end" font-family="JetBrains Mono">{diff_str}</text>
    """

grid_x_lines = ""
for d in range(0, 14):
    gx = 255 + d * 47
    grid_x_lines += f'<line x1="{gx}" y1="16" x2="{gx}" y2="565" stroke="#E4E4E7" stroke-dasharray="3,3" stroke-width="1" />'
    grid_x_lines += f'<text x="{gx}" y="584" font-size="10.5" font-weight="700" fill="#52525B" text-anchor="middle" font-family="JetBrains Mono">{d}d</text>'

HTML_04_PERT_DOTS = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
{COMMON_CSS}
body {{ width: 1740px; }}
.kpi-ledger {{ grid-template-columns: repeat(5, 1fr); }}

.pert-layout {{
    display: grid;
    grid-template-columns: 1015px 1fr;
    gap: 20px;
    align-items: stretch;
}}
.chart-panel, .table-panel {{
    background: var(--bg-surface);
    border: 1.5px solid var(--border-strong);
    border-radius: 6px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}}
.panel-hdr {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    margin-bottom: 8px;
    border-bottom: 1px solid var(--border-hairline);
}}
.panel-hdr-title {{
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 14.5px;
    color: var(--ink-primary);
}}

table.pert-tbl {{
    width: 100%;
    border-collapse: collapse;
    font-size: 10.5px;
}}
table.pert-tbl th {{
    background: var(--ink-primary);
    color: #FFF;
    padding: 6px 5px;
    border: 1px solid #3F3F46;
    text-align: right;
    font-family: var(--font-mono);
}}
table.pert-tbl th:first-child, table.pert-tbl td:first-child {{ text-align: left; }}
table.pert-tbl th:last-child, table.pert-tbl td:last-child {{ text-align: left; }}
table.pert-tbl td {{
    padding: 5px 5px;
    border-bottom: 1px solid var(--border-hairline);
    text-align: right;
    background: #FFF;
}}
.callout-note {{
    background: var(--bg-WarmTint);
    border: 1px solid var(--border-hairline);
    border-left: 4px solid var(--brand-orange);
    border-radius: 4px;
    padding: 10px 12px;
    font-size: 11px;
    line-height: 1.42;
    color: var(--ink-secondary);
    margin-top: 10px;
}}
</style>
</head>
<body>
<div class="canvas-card">
    {build_masthead(
        "04 / 06",
        "Diagrama de Puntos e Intervalos PERT (Estimación Beta vs. Duración Real)",
        "Análisis estadístico de incertidumbre por paquete: intervalo [Optimista a — Pesimista b], media esperada μ = (a+4m+b)/6 y desvío real ejecutado",
        "DISTRIBUCIÓN PERT BETA",
        "μ = (a + 4m + b)/6 · σ = (b - a)/6"
    )}

    <div class="kpi-ledger">
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>SUMA OPTIMISTA (Σa)</span><span class="mono">ESCENARIO MÍNIMO</span></div>
            <div class="kpi-figure pos">42.0d <span class="kpi-unit">días-equipo</span></div>
            <div class="kpi-context">Sin fricción técnica ni bloqueos de entorno</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>SUMA MÁS PROBABLE (Σm)</span><span class="mono">MODA ESTIMADA</span></div>
            <div class="kpi-figure">69.0d <span class="kpi-unit">días-equipo</span></div>
            <div class="kpi-context">Estimación inicial antes de iniciar los sprints</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>ESPERADO PERT (Σμ)</span><span class="mono">MEDIA PONDERADA BETA</span></div>
            <div class="kpi-figure" style="color:var(--pert-violet);">72.67d <span class="kpi-unit">días-equipo</span></div>
            <div class="kpi-context">Varianza total Σσ² = 11.44 (Σσ² crítica = 7.23)</div>
        </div>
        <div class="kpi-cell highlight-Finding">
            <div class="kpi-eyebrow"><span>ESFUERZO REAL EJECUTADO</span><span class="mono">DESVÍO +11.33d (+15.6%)</span></div>
            <div class="kpi-figure neg">84.0d <span class="kpi-unit">días-equipo reales</span></div>
            <div class="kpi-context">Ningún paquete superó su cota pesimista (b), validando el modelo</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>MAYOR DESVÍO UNITARIO</span><span class="mono">ACT-04 FIREBASE</span></div>
            <div class="kpi-figure neg">+2.83d <span class="kpi-unit">sobre μ (4.17d → 7d)</span></div>
            <div class="kpi-context">Seguido por ACT-05, ACT-07 y ACT-10 (+1.67d cada uno)</div>
        </div>
    </div>

    <div class="pert-layout">
        <div class="chart-panel">
            <div>
                <div class="panel-hdr">
                    <span class="panel-hdr-title">A. Gráfico Cleveland de Intervalos PERT [a, b] y Desplazamiento Real (μ → Real)</span>
                    <div style="display:flex; gap:14px; font-size:10.5px; font-weight:700; align-items:center;">
                        <span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#047857"/></svg> a (Optimista)</span>
                        <span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#1D4ED8"/></svg> m (Probable)</span>
                        <span style="display:flex;align-items:center;gap:4px;"><svg width="14" height="14"><polygon points="7,1 13,7 7,13 1,7" fill="#6D28D9"/></svg> μ (PERT)</span>
                        <span style="display:flex;align-items:center;gap:4px;"><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="#71717A"/></svg> b (Pesimista)</span>
                        <span style="display:flex;align-items:center;gap:4px;color:#C81E1E;"><svg width="16" height="16"><circle cx="8" cy="8" r="6.5" fill="none" stroke="#C81E1E" stroke-width="2"/><circle cx="8" cy="8" r="2.5" fill="#C81E1E"/></svg> Real Git</span>
                    </div>
                </div>
                <svg width="995" height="592">
                    {grid_x_lines}
                    {svg_pert_rows}
                </svg>
            </div>
        </div>

        <div class="table-panel">
            <div>
                <div class="panel-hdr">
                    <span class="panel-hdr-title">B. Planilla de Cálculo PERT y Causa Raíz</span>
                    <span class="mono" style="font-size:10px; color:var(--ink-muted);">VALORES TABULARES AUDITADOS</span>
                </div>
                <table class="pert-tbl mono">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>a</th>
                            <th>m</th>
                            <th>b</th>
                            <th>μ</th>
                            <th>σ</th>
                            <th>σ²</th>
                            <th>Real</th>
                            <th>Causa / Evidencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {"".join(f"<tr><td><b>{c}</b></td><td>{a}</td><td>{m}</td><td>{b}</td><td style='color:#6D28D9;font-weight:700;'>{mu:.2f}</td><td>{(b-a)/6:.2f}</td><td>{v:.2f}</td><td style='font-weight:800;color:{'#C81E1E' if r>mu+0.5 else '#047857'};'>{r:.0f}d</td><td style='font-family:var(--font-sans);font-size:9.8px;color:#3F3F46;'>{cause}</td></tr>" for c,_,a,m,mu,b,r,v,cause in pert_data)}
                        <tr style="background:var(--bg-WarmTint); font-weight:800; border-top:2px solid var(--border-strong);">
                            <td>Σ TOTAL</td>
                            <td>42</td>
                            <td>69</td>
                            <td>118</td>
                            <td style="color:#6D28D9;">72.67</td>
                            <td>—</td>
                            <td>11.44</td>
                            <td style="color:#C81E1E;">84d*</td>
                            <td style="font-family:var(--font-sans);font-size:9.8px;">45d calendario (3 células)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="callout-note">
                <b style="color:var(--ink-primary);">Lectura Analítica del Gráfico de Puntos:</b><br>
                La franja rosada sobre las filas <b>ACT-04, ACT-05, ACT-07, ACT-08 y ACT-10</b> cuantifica visualmente la distancia entre el valor esperado <b>μ (◆)</b> y el punto real ejecutado <b>(◎)</b>. Mientras que las actividades de diagnóstico, arquitectura base y pruebas cerraron exactamente sobre su media esperada (desvío ≤ 0.2d), las tareas con dependencias de servicios externos (Google Maps sin API Key, persistencia de sesión Firebase y subida binaria de fotos en Android) desplazaron su duración hacia el cuartil pesimista <b>b</b>.
            </div>
        </div>
    </div>

    <div class="footer-bar">
        <span>Cálculos verificados bajo el estándar de la cátedra de Testing y Calidad de Software: Media Beta μ = (a + 4m + b) / 6 · Desvío σ = (b - a) / 6 · Varianza σ² = ((b - a) / 6)².</span>
        <span>LÁMINA 04 / 06 · DIAGRAMA DE PUNTOS E INTERVALOS DE INCERTIDUMBRE PERT</span>
    </div>
</div>
</body>
</html>
"""

# ==============================================================================
# DIAGRAMA 5: CURVA S DE AVANCE (PLAN VS REAL) Y PUNTOS DE COMMITS EN GIT
# ==============================================================================
weeks_scurve = [
    ("Sem 1", 8, 8, "0%"),
    ("Sem 2", 18, 16, "-2%"),
    ("Sem 3", 32, 24, "-8%"),
    ("Sem 4", 46, 26, "-20%"),
    ("Sem 5", 60, 34, "-26%"),
    ("Sem 6", 74, 44, "-30%"),
    ("Sem 7", 86, 53, "-33%"),
    ("Sem 8", 94, 58, "-36%"),
    ("Sem 9", 98, 82, "-16%"),
    ("Sem 10", 100, 98, "-2%"),
    ("Sem 11", 100, 100, "0%"),
]

scurve_table_cols = "".join(
    f"<td class='mono' style='text-align:center; padding:4px 3px; font-size:9.8px; border-right:1px solid #DDD7CD;'>"
    f"<b>{w}</b><br><span style='color:#1D4ED8;'>P:{p}%</span><br><span style='color:#E86A17;font-weight:700;'>R:{r}%</span><br>"
    f"<span style='color:{'#C81E1E' if '-' in d and int(d.replace('%',''))<=-15 else '#047857'};font-weight:800;'>{d}</span></td>"
    for w, p, r, d in weeks_scurve
)

HTML_05_SCURVE_COMMITS = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
{COMMON_CSS}
body {{ width: 1740px; }}
.kpi-ledger {{ grid-template-columns: repeat(5, 1fr); }}

.dual-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: stretch;
}}
.panel-box {{
    background: var(--bg-surface);
    border: 1.5px solid var(--border-strong);
    border-radius: 6px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}}
.panel-title {{
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 700;
    color: var(--ink-primary);
}}
.panel-sub {{
    font-size: 11px;
    color: var(--ink-muted);
    margin-top: 2px;
    margin-bottom: 10px;
}}
.mini-ledger {{
    width: 100%;
    border-collapse: collapse;
    border: 1px solid var(--border-hairline);
    background: var(--bg-subtle);
    margin-top: 8px;
}}
.insight-strip {{
    margin-top: 10px;
    background: var(--bg-WarmTint);
    border: 1px solid var(--border-hairline);
    border-left: 4px solid var(--brand-orange);
    padding: 9px 12px;
    font-size: 11px;
    line-height: 1.4;
    color: var(--ink-secondary);
}}
</style>
</head>
<body>
<div class="canvas-card">
    {build_masthead(
        "05 / 06",
        "Control del Tiempo: Curva 'S' de Avance y Diagrama de Puntos de Commits en Git",
        "Comparativa de Valor Ganado / Avance Acumulado (% Planificado vs. % Real) y serie temporal exacta de los 114 commits en las 29 fechas activas",
        "AUDITORÍA GIT LOG --DATE=SHORT",
        "114 Commits · 29 Días Activos · 3 Sprints"
    )}

    <div class="kpi-ledger">
        <div class="kpi-cell highlight-Finding">
            <div class="kpi-eyebrow"><span>BRECHA MÁXIMA DE ATRASO</span><span class="mono">SEMANA 8 (12–18 OCT)</span></div>
            <div class="kpi-figure neg">-36% <span class="kpi-unit">(58% Real vs 94% Plan)</span></div>
            <div class="kpi-context">Acumulación de Home BD, Detalle y Tickets + baja comunicación</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>SALTO DE RECUPERACIÓN S3</span><span class="mono">SEMANAS 9 A 10</span></div>
            <div class="kpi-figure pos">+40% <span class="kpi-unit">de avance en 7 días</span></div>
            <div class="kpi-context">Del 58% al 98% tras dividir el equipo en 3 células (2+2+3)</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>PULSO SPRINT 1 (AGO–SEP)</span><span class="mono">10 FECHAS ACTIVAS</span></div>
            <div class="kpi-figure">43 <span class="kpi-unit">commits (37.7%)</span></div>
            <div class="kpi-context">Picos el 07/09 (12 commits) y 14/09 (11 commits)</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>PULSO SPRINT 2 (SEP–OCT)</span><span class="mono">13 FECHAS ACTIVAS</span></div>
            <div class="kpi-figure">37 <span class="kpi-unit">commits (32.5%)</span></div>
            <div class="kpi-context">Pico el 01/10 (12 commits) y valle del 11 al 18/10 (2 commits)</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>PULSO SPRINT 3 (19–26 OCT)</span><span class="mono">6 FECHAS ACTIVAS</span></div>
            <div class="kpi-figure lead">34 <span class="kpi-unit">commits (29.8%)</span></div>
            <div class="kpi-context">Récord del proyecto el 26/10 con 16 commits y 4 merges</div>
        </div>
    </div>

    <div class="dual-grid">
        <!-- PANEL IZQUIERDO: CURVA S -->
        <div class="panel-box">
            <div>
                <div class="panel-title">A. Curva "S" de Avance Físico Acumulado (% Planificado vs. % Real)</div>
                <div class="panel-sub">El área sombreada cuantifica el déficit de alcance entre las Semanas 3 y 9 antes del cierre por células</div>
                <svg width="780" height="365">
                    <!-- Sprint Background Zones -->
                    <rect x="55" y="18" width="300" height="305" fill="#EFF6FF" opacity="0.5" />
                    <rect x="355" y="18" width="190" height="305" fill="#ECFDF5" opacity="0.5" />
                    <rect x="545" y="18" width="195" height="305" fill="#FFFBEB" opacity="0.65" />
                    <text x="205" y="13" font-size="10" font-weight="800" fill="#1E40AF" text-anchor="middle" font-family="JetBrains Mono">SPRINT 1 (SEM 1–5)</text>
                    <text x="450" y="13" font-size="10" font-weight="800" fill="#047857" text-anchor="middle" font-family="JetBrains Mono">SPRINT 2 (SEM 6–8)</text>
                    <text x="642" y="13" font-size="10" font-weight="800" fill="#B45309" text-anchor="middle" font-family="JetBrains Mono">SPRINT 3 (SEM 9–11)</text>

                    <!-- Grid lines (0% to 100%: y=323 is 0%, y=23 is 100%, 3px per 1%) -->
                    <line x1="55" y1="323" x2="740" y2="323" stroke="#18181B" stroke-width="1.5" />
                    <line x1="55" y1="263" x2="740" y2="263" stroke="#DDD7CD" stroke-dasharray="3,3" />
                    <line x1="55" y1="203" x2="740" y2="203" stroke="#DDD7CD" stroke-dasharray="3,3" />
                    <line x1="55" y1="143" x2="740" y2="143" stroke="#DDD7CD" stroke-dasharray="3,3" />
                    <line x1="55" y1="83" x2="740" y2="83" stroke="#DDD7CD" stroke-dasharray="3,3" />
                    <line x1="55" y1="23" x2="740" y2="23" stroke="#DDD7CD" stroke-dasharray="3,3" />

                    <text x="46" y="327" font-size="10.5" font-weight="700" fill="#52525B" text-anchor="end" font-family="JetBrains Mono">0%</text>
                    <text x="46" y="267" font-size="10.5" font-weight="700" fill="#52525B" text-anchor="end" font-family="JetBrains Mono">20%</text>
                    <text x="46" y="207" font-size="10.5" font-weight="700" fill="#52525B" text-anchor="end" font-family="JetBrains Mono">40%</text>
                    <text x="46" y="147" font-size="10.5" font-weight="700" fill="#52525B" text-anchor="end" font-family="JetBrains Mono">60%</text>
                    <text x="46" y="87" font-size="10.5" font-weight="700" fill="#52525B" text-anchor="end" font-family="JetBrains Mono">80%</text>
                    <text x="46" y="27" font-size="10.5" font-weight="700" fill="#52525B" text-anchor="end" font-family="JetBrains Mono">100%</text>

                    <!-- X Axis labels (x = 75 + i*64) -->
                    {"".join(f'<text x="{75+i*64}" y="344" font-size="10" font-weight="700" fill="#27272A" text-anchor="middle" font-family="JetBrains Mono">Sem {i+1}</text>' for i in range(11))}

                    <!-- Legend Box -->
                    <rect x="68" y="34" width="225" height="44" rx="4" fill="#FFFFFF" stroke="#18181B" stroke-width="1.2" />
                    <line x1="78" y1="48" x2="104" y2="48" stroke="#1D4ED8" stroke-width="2.5" stroke-dasharray="5,3" />
                    <circle cx="91" cy="48" r="3.5" fill="#1D4ED8" />
                    <text x="112" y="52" font-size="10" font-weight="700" fill="#1E40AF">% Planificado (Línea Base)</text>
                    <line x1="78" y1="66" x2="104" y2="66" stroke="#E86A17" stroke-width="3" />
                    <circle cx="91" cy="66" r="4" fill="#E86A17" />
                    <text x="112" y="70" font-size="10" font-weight="700" fill="#9A3412">% Real Ejecutado (Auditoría Git)</text>

                    <!-- Shaded Deficit Area -->
                    <polygon points="75,299 139,269 203,227 267,185 331,143 395,101 459,65 523,41 587,29 651,23 587,77 523,149 459,164 395,191 331,221 267,245 203,251 139,275 75,299" fill="#FDE68A" opacity="0.55" />

                    <!-- PLANNED LINE -->
                    <polyline fill="none" stroke="#1D4ED8" stroke-width="2.5" stroke-dasharray="6,4"
                        points="75,299 139,269 203,227 267,185 331,143 395,101 459,65 523,41 587,29 651,23 715,23" />

                    <!-- REAL LINE -->
                    <polyline fill="none" stroke="#E86A17" stroke-width="3.5"
                        points="75,299 139,275 203,251 267,245 331,221 395,191 459,164 523,149 587,77 651,29 715,23" />

                    <!-- Points Planned -->
                    {"".join(f'<circle cx="{x}" cy="{y}" r="4" fill="#1D4ED8" />' for x, y in [(75,299),(139,269),(203,227),(267,185),(331,143),(395,101),(459,65),(523,41),(587,29),(651,23),(715,23)])}

                    <!-- Points Real -->
                    {"".join(f'<circle cx="{x}" cy="{y}" r="5.5" fill="#E86A17" stroke="#FFF" stroke-width="1.5" />' for x, y in [(75,299),(139,275),(203,251),(267,245),(331,221),(395,191),(459,164),(523,149),(587,77),(651,29),(715,23)])}

                    <!-- Callout Annotations -->
                    <rect x="200" y="262" width="195" height="36" rx="4" fill="#FEF2F2" stroke="#C81E1E" stroke-width="1.2" />
                    <text x="208" y="276" font-size="9.8" font-weight="800" fill="#991B1B">Sem 4–5: Brecha -26% (Amarillo)</text>
                    <text x="208" y="290" font-size="9.2" fill="#7F1D1D">Mapa pantalla negra + Firebase pospuesto</text>

                    <rect x="430" y="182" width="182" height="36" rx="4" fill="#FFFBEB" stroke="#B45309" stroke-width="1.2" />
                    <text x="438" y="196" font-size="9.8" font-weight="800" fill="#92400E">Sem 8: Brecha máxima -36%</text>
                    <text x="438" y="210" font-size="9.2" fill="#78350F">Home BD y Detalle pasan a Sprint 3</text>

                    <rect x="572" y="116" width="162" height="36" rx="4" fill="#ECFDF5" stroke="#047857" stroke-width="1.2" />
                    <text x="580" y="130" font-size="9.8" font-weight="800" fill="#065F46">Sem 9–10: Salto +40%</text>
                    <text x="580" y="144" font-size="9.2" fill="#047857">3 Células + 59 tests PASS</text>
                </svg>

                <!-- Tabular Reconciliation Strip -->
                <table class="mini-ledger">
                    <tr>{scurve_table_cols}</tr>
                </table>
            </div>

            <div class="insight-strip">
                <b>Reconciliación Numérica Semanal:</b> La tabla inferior muestra exactamente el par <b>(Planificado / Real / Brecha)</b> de cada semana. El proyecto llegó a estar <b>36 puntos porcentuales por debajo del plan</b> en la Semana 8 y recuperó <b>40 puntos en las Semanas 9 y 10</b> mediante trabajo paralelo en 3 células.
            </div>
        </div>

        <!-- PANEL DERECHO: DIAGRAMA DE PUNTOS Y PULSOS DE COMMITS EN GIT -->
        <div class="panel-box">
            <div>
                <div class="panel-title">B. Diagrama de Puntos e Impulsos de los 114 Commits Reales en Git</div>
                <div class="panel-sub">Distribución exacta en las 29 fechas con actividad entre el 24/08/2026 y el 26/10/2026 (43 S1 + 37 S2 + 34 S3 = 114)</div>
                <svg width="780" height="415">
                    <!-- Y axis grid (0, 5, 10, 15, 20 commits) -->
                    <line x1="50" y1="345" x2="755" y2="345" stroke="#18181B" stroke-width="1.5" />
                    <line x1="50" y1="270" x2="755" y2="270" stroke="#DDD7CD" stroke-dasharray="3,3" />
                    <line x1="50" y1="195" x2="755" y2="195" stroke="#DDD7CD" stroke-dasharray="3,3" />
                    <line x1="50" y1="120" x2="755" y2="120" stroke="#DDD7CD" stroke-dasharray="3,3" />
                    <line x1="50" y1="45" x2="755" y2="45" stroke="#DDD7CD" stroke-dasharray="3,3" />

                    <text x="42" y="349" font-size="10.5" font-weight="700" fill="#52525B" text-anchor="end" font-family="JetBrains Mono">0</text>
                    <text x="42" y="274" font-size="10.5" font-weight="700" fill="#52525B" text-anchor="end" font-family="JetBrains Mono">5</text>
                    <text x="42" y="199" font-size="10.5" font-weight="700" fill="#52525B" text-anchor="end" font-family="JetBrains Mono">10</text>
                    <text x="42" y="124" font-size="10.5" font-weight="700" fill="#52525B" text-anchor="end" font-family="JetBrains Mono">15</text>
                    <text x="42" y="49" font-size="10.5" font-weight="700" fill="#52525B" text-anchor="end" font-family="JetBrains Mono">20</text>

                    <!-- Real Git commit dates (29 active days, 114 commits total) -->
                    {"".join(
                        f'<line x1="{66 + idx*24}" y1="345" x2="{66 + idx*24}" y2="{345 - cnt*15}" stroke="{col}" stroke-width="7" stroke-linecap="butt" opacity="0.28" />'
                        f'<circle cx="{66 + idx*24}" cy="{345 - cnt*15}" r="5.5" fill="{col}" stroke="#FFF" stroke-width="1.4" />'
                        f'<text x="{66 + idx*24}" y="{335 - cnt*15}" font-size="9.5" font-weight="800" fill="{col}" text-anchor="middle" font-family="JetBrains Mono">{cnt}</text>'
                        f'<text x="{66 + idx*24}" y="362" font-size="8.8" font-weight="700" fill="#27272A" text-anchor="end" font-family="JetBrains Mono" transform="rotate(-45 {66 + idx*24} 362)">{dt}</text>'
                        for idx, (dt, cnt, col) in enumerate([
                            ("24 Ago", 3, "#1D4ED8"), ("07 Sep", 12, "#1D4ED8"), ("09 Sep", 2, "#1D4ED8"),
                            ("10 Sep", 6, "#1D4ED8"), ("13 Sep", 1, "#1D4ED8"), ("14 Sep", 11, "#1D4ED8"),
                            ("17 Sep", 2, "#1D4ED8"), ("21 Sep", 1, "#1D4ED8"), ("24 Sep", 1, "#1D4ED8"),
                            ("25 Sep", 4, "#B45309"), ("26 Sep", 1, "#047857"), ("27 Sep", 3, "#047857"),
                            ("28 Sep", 5, "#047857"), ("29 Sep", 1, "#047857"), ("30 Sep", 2, "#047857"),
                            ("01 Oct", 12, "#047857"), ("04 Oct", 1, "#047857"), ("05 Oct", 3, "#047857"),
                            ("08 Oct", 2, "#047857"), ("10 Oct", 4, "#047857"), ("11 Oct", 1, "#047857"),
                            ("15 Oct", 1, "#71717A"), ("18 Oct", 1, "#71717A"), ("19 Oct", 6, "#C81E1E"),
                            ("20 Oct", 2, "#C81E1E"), ("22 Oct", 1, "#C81E1E"), ("23 Oct", 1, "#C81E1E"),
                            ("25 Oct", 8, "#C81E1E"), ("26 Oct", 16, "#C81E1E")
                        ])
                    )}

                    <!-- Callout Boxes -->
                    <rect x="72" y="96" width="165" height="36" rx="4" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.2" />
                    <text x="80" y="110" font-size="9.8" font-weight="800" fill="#1E40AF">Picos S1 (07 y 14 Sep: 23 c.)</text>
                    <text x="80" y="124" font-size="9.2" fill="#1E3A8A">Maquetado UI Home, Login y Filtros</text>

                    <rect x="345" y="96" width="172" height="36" rx="4" fill="#ECFDF5" stroke="#047857" stroke-width="1.2" />
                    <text x="353" y="110" font-size="9.8" font-weight="800" fill="#065F46">Pico S2 (01 Oct: 12 commits)</text>
                    <text x="353" y="124" font-size="9.2" fill="#047857">Alta Alerta, Ajustes y Merges</text>

                    <rect x="442" y="210" width="150" height="34" rx="4" fill="#F4F4F5" stroke="#71717A" stroke-width="1.2" />
                    <text x="450" y="224" font-size="9.5" font-weight="800" fill="#27272A">Valle 11–18 Oct (2 commits)</text>
                    <text x="450" y="237" font-size="9" fill="#52525B">Baja comunicación (Bitácora)</text>

                    <rect x="535" y="42" width="205" height="36" rx="4" fill="#FEF2F2" stroke="#C81E1E" stroke-width="1.2" />
                    <text x="543" y="56" font-size="9.8" font-weight="800" fill="#991B1B">Cierre S3 (25–26 Oct: 24 commits)</text>
                    <text x="543" y="70" font-size="9.2" fill="#7F1D1D">Detalle+Wpp, Lo Vi y 4 Merges finales</text>
                </svg>
            </div>

            <div class="insight-strip">
                <b>Patrón Empírico de Trabajo Académico:</b> El gráfico demuestra que el equipo trabajó por <b>pulsos de integración sincrónica</b> antes de cada hito (07/09, 14/09, 25/09, 01/10, 19/10 y 25–26/10), validando con total honestidad el valle del 11 al 18 de octubre reportado en la Bitácora.
            </div>
        </div>
    </div>

    <div class="footer-bar">
        <span>Verificación aritmética: 3+12+2+6+1+11+2+1+1+4 (43 en S1) + 1+3+5+1+2+12+1+3+2+4+1+1+1 (37 en S2) + 6+2+1+1+8+16 (34 en S3) = 114 commits exactos.</span>
        <span>LÁMINA 05 / 06 · CURVA S DE AVANCE Y DIAGRAMA DE PUNTOS DE COMMITS</span>
    </div>
</div>
</body>
</html>
"""

# ==============================================================================
# DIAGRAMA 6: MATRIZ DE RIESGOS (PxI), SEMAFORO Y MATRIZ RACI REAL
# ==============================================================================
HTML_06_RISKS_RACI = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
{COMMON_CSS}
body {{ width: 1760px; }}
.kpi-ledger {{ grid-template-columns: repeat(5, 1fr); }}

.two-col {{
    display: grid;
    grid-template-columns: 585px 1fr;
    gap: 20px;
    align-items: stretch;
}}
.box-card {{
    background: var(--bg-surface);
    border: 1.5px solid var(--border-strong);
    border-radius: 6px;
    padding: 15px 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}}
.sec-h2 {{
    font-family: var(--font-display);
    font-size: 14.2px;
    font-weight: 700;
    color: var(--ink-primary);
    margin-bottom: 10px;
    border-bottom: 1.5px solid var(--border-strong);
    padding-bottom: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}}

table.heatmap {{
    width: 100%;
    border-collapse: collapse;
    font-size: 10.5px;
    text-align: center;
    margin-bottom: 12px;
    font-family: var(--font-mono);
}}
table.heatmap th, table.heatmap td {{
    border: 1.5px solid #FFFFFF;
    padding: 6px 4px;
    font-weight: 700;
}}
.hm-hdr {{ background: var(--ink-primary); color: #FFF; }}
.hm-sub {{ background: #27272A; color: #E4E4E7; font-size: 10px; }}
.hm-low {{ background: #D1FAE5; color: #065F46; }}
.hm-med {{ background: #FEF3C7; color: #92400E; }}
.hm-high {{ background: #FFEDD5; color: #9A3412; }}
.hm-crit {{ background: #FEE2E2; color: #991B1B; }}

.risk-pill {{
    display: inline-block;
    background: #18181B;
    color: #FFF;
    padding: 1.5px 5px;
    border-radius: 3px;
    font-size: 9.5px;
    margin: 1px;
    font-family: var(--font-mono);
    font-weight: 800;
}}

.risk-list {{
    display: flex;
    flex-direction: column;
    gap: 5.5px;
    font-size: 10.6px;
    line-height: 1.38;
}}
.risk-row {{
    background: var(--bg-subtle);
    border: 1px solid var(--border-hairline);
    border-left: 3.5px solid var(--crit-red);
    padding: 5px 8px;
    border-radius: 3px;
}}
.risk-row.med {{ border-left-color: var(--warn-amber); }}

/* Taste-skill §2.1: Each person gets a stable initial and a pale tint of their own hue */
.avatar-chip {{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    font-family: var(--font-mono);
    font-size: 9.5px;
    font-weight: 800;
    margin-bottom: 2px;
    border: 1px solid rgba(0,0,0,0.15);
}}

table.raci-tbl {{
    width: 100%;
    border-collapse: collapse;
    font-size: 10.6px;
}}
table.raci-tbl th {{
    background: var(--ink-primary);
    color: #FFF;
    padding: 6px 5px;
    border: 1px solid #3F3F46;
    text-align: center;
}}
table.raci-tbl td {{
    padding: 5px 6px;
    border-bottom: 1px solid var(--border-hairline);
    border-right: 1px solid var(--border-hairline);
    background: #FFF;
    text-align: center;
    font-family: var(--font-mono);
}}
table.raci-tbl td.left {{
    text-align: left;
    font-family: var(--font-sans);
    font-weight: 600;
    color: var(--ink-primary);
}}
.r-tag {{ background: #DBEAFE; color: #1E40AF; border: 1px solid #93C5FD; font-weight: 800; padding: 1px 6px; border-radius: 3px; display: inline-block; }}
.a-tag {{ background: #FEE2E2; color: #991B1B; border: 1px solid #FCA5A5; font-weight: 800; padding: 1px 6px; border-radius: 3px; display: inline-block; }}
.c-tag {{ background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; font-weight: 700; padding: 1px 6px; border-radius: 3px; display: inline-block; }}
.i-tag {{ background: #F4F4F5; color: #71717A; font-weight: 600; padding: 1px 6px; border-radius: 3px; display: inline-block; }}

.sem-grid {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 8px;
}}
.sem-card {{
    background: var(--bg-subtle);
    border-radius: 4px;
    padding: 9px 11px;
    border: 1px solid var(--border-hairline);
}}
.sem-dot {{
    display: inline-block;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    margin-right: 5px;
}}
</style>
</head>
<body>
<div class="canvas-card">
    {build_masthead(
        "06 / 06",
        "Panel de Control Operativo: Matriz de Riesgos (P×I), Semáforos y Matriz RACI Real",
        "Riesgos técnicos y de gestión materializados y mitigados en el cuatrimestre, evolución del semáforo de salud y asignación RACI de los 7 integrantes",
        "GOBERNANZA Y CONTROL DE RIESGOS",
        "7 Riesgos Reales · 11 Entregables RACI · 3 Células"
    )}

    <div class="kpi-ledger">
        <div class="kpi-cell highlight-Finding">
            <div class="kpi-eyebrow"><span>RIESGOS MATERIALIZADOS Y RESUELTOS</span><span class="mono">TASA DE MITIGACIÓN</span></div>
            <div class="kpi-figure pos">7 / 7 <span class="kpi-unit">riesgos mitigados (100%)</span></div>
            <div class="kpi-context">Exposición máxima cayó de 25 (Crítico) a ≤ 4 (Bajo) tras Sprint 3</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>ESTRUCTURA DEL EQUIPO (S3)</span><span class="mono">3 CÉLULAS AUTÓNOMAS</span></div>
            <div class="kpi-figure">2 + 2 + 3 <span class="kpi-unit">integrantes</span></div>
            <div class="kpi-context">Célula 1 (Jona/Fran) · Célula 2 (Rodri/Maxi) · Célula 3 (Sol/Yerik/Marti)</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>CANALES Y RITUALES REALES</span><span class="mono">BITÁCORA INC. 1 PÁG. 28</span></div>
            <div class="kpi-figure" style="font-size:17px; margin:5px 0;">Trello + Meet 2h + Wpp</div>
            <div class="kpi-context">Decisiones por votación grupal y división equitativa de tareas</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>COSTO DE INFRAESTRUCTURA MVP</span><span class="mono">ADQUISICIONES REALES</span></div>
            <div class="kpi-figure pos">$0 <span class="kpi-unit">ARS / mes en nube</span></div>
            <div class="kpi-context">Firebase Spark + OSM/CartoDB Free + Expo EAS Free (+ $25 USD Play Store)</div>
        </div>
        <div class="kpi-cell">
            <div class="kpi-eyebrow"><span>ESTADO DEL SEMÁFORO ACTUAL</span><span class="mono">CIERRE 26 OCT 2026</span></div>
            <div class="kpi-figure pos">VERDE <span class="kpi-unit">(98% Avance)</span></div>
            <div class="kpi-context">Amarillo en S1 → Rojo/Amarillo en S2 → Verde al cerrar S3</div>
        </div>
    </div>

    <div class="two-col">
        <!-- COL IZQUIERDA: MATRIZ P x I + LISTA DE RIESGOS -->
        <div class="box-card">
            <div>
                <div class="sec-h2">
                    <span>A. Matriz de Exposición de Riesgos Reales (P × I)</span>
                    <span class="mono" style="font-size:10px; color:var(--ink-muted);">ESCALA 1 A 25</span>
                </div>
                <table class="heatmap">
                    <thead>
                        <tr>
                            <th class="hm-hdr" style="width:92px;">Prob \ Imp</th>
                            <th class="hm-sub">1. Muy Bajo</th>
                            <th class="hm-sub">2. Bajo</th>
                            <th class="hm-sub">3. Medio</th>
                            <th class="hm-sub">4. Alto</th>
                            <th class="hm-sub">5. Crítico</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="hm-sub">5. Casi Seguro</td>
                            <td class="hm-med">5</td>
                            <td class="hm-med">10</td>
                            <td class="hm-high">15</td>
                            <td class="hm-crit">20 <span class="risk-pill">R-04</span></td>
                            <td class="hm-crit">25 <span class="risk-pill">R-01</span></td>
                        </tr>
                        <tr>
                            <td class="hm-sub">4. Probable</td>
                            <td class="hm-low">4</td>
                            <td class="hm-med">8</td>
                            <td class="hm-high">12 <span class="risk-pill">R-07</span></td>
                            <td class="hm-crit">16 <span class="risk-pill">R-03</span><span class="risk-pill">R-06</span></td>
                            <td class="hm-crit">20 <span class="risk-pill">R-02</span></td>
                        </tr>
                        <tr>
                            <td class="hm-sub">3. Posible</td>
                            <td class="hm-low">3</td>
                            <td class="hm-med">6</td>
                            <td class="hm-med">9</td>
                            <td class="hm-high">12 <span class="risk-pill">R-05</span></td>
                            <td class="hm-high">15</td>
                        </tr>
                        <tr>
                            <td class="hm-sub">2. Improbable</td>
                            <td class="hm-low">2</td>
                            <td class="hm-low">4</td>
                            <td class="hm-med">6</td>
                            <td class="hm-med">8</td>
                            <td class="hm-med">10</td>
                        </tr>
                        <tr>
                            <td class="hm-sub">1. Raro</td>
                            <td class="hm-low">1</td>
                            <td class="hm-low">2</td>
                            <td class="hm-low">3</td>
                            <td class="hm-low">4</td>
                            <td class="hm-med">5</td>
                        </tr>
                    </tbody>
                </table>

                <div class="risk-list">
                    <div class="risk-row"><span class="risk-pill">R-01 (25→2)</span> <b>Pantalla negra en Mapa Android (17/09):</b> Fallo de Google Maps nativo sin API Key. <b>Mitigación (25/09):</b> Motor <code>Leaflet 1.9.4 + WebView</code> con tiles OSM/CartoDB gratuitos.</div>
                    <div class="risk-row"><span class="risk-pill">R-02 (20→2)</span> <b>Pérdida de sesión y desincronización de perfil:</b> Ocurrió en S2. <b>Mitigación (08–20/10):</b> <code>AsyncStorage</code> en <code>ConexionFirebase</code> y refresco reactivo en <code>AuthContext</code>.</div>
                    <div class="risk-row"><span class="risk-pill">R-04 (20→4)</span> <b>Conflictos de Merge en Git entre 7 miembros:</b> Colisiones en 5 archivos (01/10 y 26/10). <b>Mitigación:</b> División en 3 células autónomas y conciliación centralizada.</div>
                    <div class="risk-row"><span class="risk-pill">R-03 (16→2)</span> <b>Fallo de fotos en Android ("File not found"):</b> Detectado el 20/10 al usar <code>fetch(uri)</code>. <b>Mitigación:</b> Captura con <code>base64: true</code> y subida vía <code>uploadString</code>.</div>
                    <div class="risk-row"><span class="risk-pill">R-06 (16→1)</span> <b>Atraso de Firebase en Sprint 1:</b> Se retiró Firebase el 25/09 (<code>71eb747</code>) para proteger la demo; se implementó el Singleton y conectó el 27/09.</div>
                    <div class="risk-row med"><span class="risk-pill">R-05 (12→3)</span> <b>Exposición de datos del vecino:</b> Detectado en Revisión IA (Etapa 1/2). <b>Mitigación:</b> Aviso explícito de consentimiento y redirección segura a <code>wa.me</code>.</div>
                    <div class="risk-row med"><span class="risk-pill">R-07 (12→3)</span> <b>Baja comunicación grupal en semanas intermedias:</b> Registrado en Bitácora (pág. 34). <b>Mitigación:</b> Intervención de PO y SM con reuniones semanales en Meet y votación.</div>
                </div>
            </div>
        </div>

        <!-- COL DERECHA: RACI + SEMAFOROS -->
        <div class="box-card">
            <div>
                <div class="sec-h2">
                    <span>B. Matriz de Asignación de Responsabilidades (RACI) — 7 Integrantes</span>
                    <span class="mono" style="font-size:10px; color:var(--ink-muted);">[R] EJECUTA · [A] APRUEBA · [C] CONSULTADO · [I] INFORMADO</span>
                </div>
                <table class="raci-tbl">
                    <thead>
                        <tr>
                            <th style="width:235px; text-align:left; padding-left:8px;">Entregable / Paquete Auditado</th>
                            <th><span class="avatar-chip" style="background:#FFEDD5;color:#9A3412;">JR</span><br>Jona<br><span style="font-size:8.8px;font-weight:400;color:#D4D4D8;">PO · Cél. 1</span></th>
                            <th><span class="avatar-chip" style="background:#FCE7F3;color:#9D174D;">SC</span><br>Sol<br><span style="font-size:8.8px;font-weight:400;color:#D4D4D8;">SM · Cél. 3</span></th>
                            <th><span class="avatar-chip" style="background:#DBEAFE;color:#1E40AF;">RP</span><br>Rodrigo<br><span style="font-size:8.8px;font-weight:400;color:#D4D4D8;">QA · Cél. 2</span></th>
                            <th><span class="avatar-chip" style="background:#D1FAE5;color:#065F46;">MD</span><br>Maxi<br><span style="font-size:8.8px;font-weight:400;color:#D4D4D8;">Dev · Cél. 2</span></th>
                            <th><span class="avatar-chip" style="background:#EDE9FE;color:#5B21B6;">FG</span><br>Fran<br><span style="font-size:8.8px;font-weight:400;color:#D4D4D8;">Dev · Cél. 1</span></th>
                            <th><span class="avatar-chip" style="background:#FEF3C7;color:#92400E;">YR</span><br>Yerik<br><span style="font-size:8.8px;font-weight:400;color:#D4D4D8;">Dev · Cél. 3</span></th>
                            <th><span class="avatar-chip" style="background:#E0F2FE;color:#075985;">MG</span><br>Martina<br><span style="font-size:8.8px;font-weight:400;color:#D4D4D8;">Dev · Cél. 3</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="left">1. Diagnóstico, Encuesta y Bitácora (Inc. 1)</td>
                            <td><span class="a-tag">A</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="r-tag">R</span></td>
                        </tr>
                        <tr>
                            <td class="left">2. SRS, MoSCoW, Wireframes Padlet y WCAG</td>
                            <td><span class="a-tag">A</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="c-tag">C</span></td>
                            <td><span class="i-tag">I</span></td>
                            <td><span class="i-tag">I</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="r-tag">R</span></td>
                        </tr>
                        <tr>
                            <td class="left">3. Arquitectura Base, Theme y ConexionFirebase</td>
                            <td><span class="a-tag">A</span> <span class="r-tag">R</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="c-tag">C</span></td>
                            <td><span class="i-tag">I</span></td>
                            <td><span class="i-tag">I</span></td>
                            <td><span class="i-tag">I</span></td>
                            <td><span class="i-tag">I</span></td>
                        </tr>
                        <tr>
                            <td class="left">4. Autenticación Firebase, Registro y Sesión</td>
                            <td><span class="a-tag">A</span> <span class="r-tag">R</span></td>
                            <td><span class="i-tag">I</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="i-tag">I</span></td>
                            <td><span class="i-tag">I</span></td>
                        </tr>
                        <tr>
                            <td class="left">5. Mapa Interactivo (v1 Martina → Leaflet Jona)</td>
                            <td><span class="a-tag">A</span> <span class="r-tag">R</span></td>
                            <td><span class="i-tag">I</span></td>
                            <td><span class="c-tag">C</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="i-tag">I</span></td>
                            <td><span class="r-tag">R</span></td>
                        </tr>
                        <tr>
                            <td class="left">6. Home Feed en Vivo, Filtros y Modal Tarjetas</td>
                            <td><span class="c-tag">C</span></td>
                            <td><span class="a-tag">A</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="i-tag">I</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="i-tag">I</span></td>
                        </tr>
                        <tr>
                            <td class="left">7. Publicar Alerta, Cámara/Galería y Geocoding</td>
                            <td><span class="a-tag">A</span> <span class="r-tag">R</span></td>
                            <td><span class="c-tag">C</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="i-tag">I</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="i-tag">I</span></td>
                        </tr>
                        <tr>
                            <td class="left">8. Perfil, Borrado por Autor y "Mascota Encontrada"</td>
                            <td><span class="c-tag">C</span></td>
                            <td><span class="a-tag">A</span> <span class="r-tag">R</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="i-tag">I</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="i-tag">I</span></td>
                        </tr>
                        <tr>
                            <td class="left">9. Ficha Detalle [id], WhatsApp, "Lo Vi" y Share</td>
                            <td><span class="a-tag">A</span> <span class="r-tag">R</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="c-tag">C</span></td>
                            <td><span class="i-tag">I</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="i-tag">I</span></td>
                        </tr>
                        <tr>
                            <td class="left">10. Soporte (9 FAQs + Tickets), Guía Uso y Ajustes</td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="a-tag">A</span> <span class="r-tag">R</span></td>
                            <td><span class="c-tag">C</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="i-tag">I</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="r-tag">R</span></td>
                        </tr>
                        <tr>
                            <td class="left">11. Suite de 59 Pruebas Automatizadas y Merges Git</td>
                            <td><span class="a-tag">A</span> <span class="r-tag">R</span></td>
                            <td><span class="c-tag">C</span></td>
                            <td><span class="r-tag">R</span></td>
                            <td><span class="i-tag">I</span></td>
                            <td><span class="i-tag">I</span></td>
                            <td><span class="i-tag">I</span></td>
                            <td><span class="i-tag">I</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <div class="sec-h2" style="margin-top:12px;">
                    <span>C. Evolución Real del Semáforo Operativo por Sprint</span>
                    <span class="mono" style="font-size:10px; color:var(--ink-muted);">CONTROL DE SALUD DEL PROYECTO</span>
                </div>
                <div class="sem-grid">
                    <div class="sem-card" style="border-top:4px solid #D97706; background:#FFFBEB;">
                        <div style="font-weight:800; font-size:11.2px; color:#92400E;"><span class="sem-dot" style="background:#D97706;"></span>SPRINT 1 · AMARILLO</div>
                        <div style="font-size:10.3px; color:#78350F; margin-top:4px; line-height:1.35;">
                            <b>24 Ago – 25 Sep (Brecha -26%):</b> Incremento 1 y UI listos, pero falló el mapa nativo en Android y se debió posponer Firebase al cierre del sprint.
                        </div>
                    </div>
                    <div class="sem-card" style="border-top:4px solid #C81E1E; background:#FEF2F2;">
                        <div style="font-weight:800; font-size:11.2px; color:#991B1B;"><span class="sem-dot" style="background:#C81E1E;"></span>SPRINT 2 · ROJO → AMARILLO</div>
                        <div style="font-size:10.3px; color:#7F1D1D; margin-top:4px; line-height:1.35;">
                            <b>26 Sep – 18 Oct (Brecha -36%):</b> Conectados Firestore, Auth y Alta Alerta, pero quedaron pendientes Home BD, Detalle+Wpp y Tickets junto a colisiones Git.
                        </div>
                    </div>
                    <div class="sem-card" style="border-top:4px solid #047857; background:#ECFDF5;">
                        <div style="font-weight:800; font-size:11.2px; color:#065F46;"><span class="sem-dot" style="background:#047857;"></span>SPRINT 3 · VERDE (META)</div>
                        <div style="font-size:10.3px; color:#047857; margin-top:4px; line-height:1.35;">
                            <b>19 Oct – 26 Oct (Avance 98%):</b> Las 3 células (2+2+3) cerraron las 10 tareas, conciliaron las 4 ramas en Git y aprobaron los 59 tests automatizados.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="footer-bar">
        <span>Nota de Auditoría RACI: En el Sprint 2 también participó el usuario `Bresser` en el commit `c7795b7` (08/10/2026) integrando Firebase Authentication junto a Jona y Fran.</span>
        <span>LÁMINA 06 / 06 · MATRIZ DE RIESGOS (P×I), SEMÁFOROS Y MATRIZ RACI</span>
    </div>
</div>
</body>
</html>
"""

DIAGRAMS = [
    ("01_edt_wbs_patitas.png", HTML_01_EDT, 1700),
    ("02_red_pert_cpm_camino_critico.png", HTML_02_CPM, 1740),
    ("03_cronograma_gantt_plan_vs_real.png", HTML_03_GANTT, 1760),
    ("04_diagrama_puntos_pert_desvios.png", HTML_04_PERT_DOTS, 1740),
    ("05_curva_s_y_velocidad_commits_git.png", HTML_05_SCURVE_COMMITS, 1740),
    ("06_matriz_riesgos_semaforo_y_raci.png", HTML_06_RISKS_RACI, 1760),
]

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for filename, html_content, width in DIAGRAMS:
            page = browser.new_page(viewport={"width": width, "height": 950}, device_scale_factor=2)
            page.set_content(html_content, wait_until="networkidle")
            card = page.locator(".canvas-card")
            out_path = os.path.join(OUTPUT_DIR, filename)
            card.screenshot(path=out_path)
            print(f"[OK] Generated: {out_path}")
            page.close()
        browser.close()

if __name__ == "__main__":
    main()
