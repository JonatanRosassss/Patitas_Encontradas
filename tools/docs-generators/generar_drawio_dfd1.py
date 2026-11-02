import xml.etree.ElementTree as ET

def generate_dfd_clean():
    mxfile = ET.Element('mxfile', {
        'host': 'app.diagrams.net',
        'modified': '2026-10-30T01:15:00.000Z',
        'agent': 'Antigravity Multi-Agent Architect',
        'version': '24.0.0',
        'type': 'device'
    })

    # ==========================================
    # PÁGINA 1: DFD NIVEL 1
    # ==========================================
    diag1 = ET.SubElement(mxfile, 'diagram', {
        'id': 'DFD_Nivel_1',
        'name': '1. DFD Nivel 1'
    })
    model1 = ET.SubElement(diag1, 'mxGraphModel', {
        'dx': '1600', 'dy': '1100', 'grid': '1', 'gridSize': '10',
        'guides': '1', 'tooltips': '1', 'connect': '1', 'arrows': '1',
        'fold': '1', 'page': '1', 'pageScale': '1',
        'pageWidth': '1600', 'pageHeight': '1200', 'math': '0', 'shadow': '0'
    })
    root1 = ET.SubElement(model1, 'root')
    ET.SubElement(root1, 'mxCell', {'id': '0'})
    ET.SubElement(root1, 'mxCell', {'id': '1', 'parent': '0'})

    # --- BANNER DE TÍTULO ---
    title_text = "SISTEMA PATITAS ENCONTRADAS (UNPILAR) — DIAGRAMA DE FLUJO DE DATOS (DFD) NIVEL 1\nBalanceado con Nivel 0 (5 Entradas, 7 Salidas, 3 Almacenes, 4 Macroprocesos)"
    header = ET.SubElement(root1, 'mxCell', {
        'id': 'header_banner',
        'value': title_text,
        'style': 'text;html=0;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontFamily=Nunito,Helvetica,Arial;fontSize=15;fontStyle=1;fontColor=#2C3E50;',
        'vertex': '1',
        'parent': '1'
    })
    ET.SubElement(header, 'mxGeometry', {'x': '380', 'y': '25', 'width': '800', 'height': '50', 'as': 'geometry'})

    # --- LEYENDA SEMÁNTICA ---
    legend_text = "Convención de Flujos:  [Azul] Entradas EE (Inputs)   |   [Verde] Salidas EE (Outputs)   |   [Naranja] Escritura en Almacén   |   [Violeta] Lectura de Almacén"
    legend = ET.SubElement(root1, 'mxCell', {
        'id': 'legend_box',
        'value': legend_text,
        'style': 'rounded=1;whiteSpace=wrap;html=0;fillColor=#F8F9FA;strokeColor=#CFD8DC;strokeWidth=1;fontSize=11;fontFamily=Nunito,Helvetica,Arial;fontStyle=1;fontColor=#455A64;align=center;',
        'vertex': '1',
        'parent': '1'
    })
    ET.SubElement(legend, 'mxGeometry', {'x': '400', 'y': '85', 'width': '760', 'height': '32', 'as': 'geometry'})

    # --- ENTIDAD EXTERNA (EE) ---
    ee_text = "Usuario (EE)\n\n[ENTIDAD EXTERNA]\n\n• Vecino de Pilar\n• Dueño de Mascota\n• Informante / Rescatista"
    ee_node = ET.SubElement(root1, 'mxCell', {
        'id': 'EE_USUARIO',
        'value': ee_text,
        'style': 'rounded=1;arcSize=8;whiteSpace=wrap;html=0;fillColor=#ECEFF1;strokeColor=#455A64;strokeWidth=2.5;fontFamily=Nunito,Helvetica,Arial;fontSize=12;fontStyle=1;fontColor=#263238;shadow=1;align=center;verticalAlign=middle;',
        'vertex': '1',
        'parent': '1'
    })
    ET.SubElement(ee_node, 'mxGeometry', {'x': '80', 'y': '160', 'width': '200', 'height': '880', 'as': 'geometry'})

    # --- MACROPROCESOS (Centro) ---
    p_style = 'ellipse;whiteSpace=wrap;html=0;fillColor=#FFF3E0;strokeColor=#FF8A00;strokeWidth=2.5;fontFamily=Nunito,Helvetica,Arial;fontStyle=1;fontSize=12;fontColor=#5A3A1F;shadow=1;align=center;verticalAlign=middle;'
    
    procesos = [
        ('P1', "1\n\nGestionar cuenta de usuario\n(Auth, Perfil, Recuperación)", 580, 170, 250, 105),
        ('P2', "2\n\nPublicar reporte de mascota\n(Validación, GPS, Fotos)", 580, 380, 250, 105),
        ('P3', "3\n\nConsultar mapa y feed de alertas\n(Filtro geoespacial, Radio Km)", 580, 590, 250, 105),
        ('P4', "4\n\nGestionar avistamiento y cierre\n(Avistamientos, WhatsApp, Cierre)", 580, 800, 250, 135),
    ]

    for pid, ptext, px, py, pw, ph in procesos:
        pnode = ET.SubElement(root1, 'mxCell', {
            'id': pid,
            'value': ptext,
            'style': p_style,
            'vertex': '1',
            'parent': '1'
        })
        ET.SubElement(pnode, 'mxGeometry', {'x': str(px), 'y': str(py), 'width': str(pw), 'height': str(ph), 'as': 'geometry'})

    # --- ALMACENES DE DATOS (Derecha) ---
    d_style = 'shape=partialRectangle;right=0;left=1;top=1;bottom=1;fillColor=#E8F5E9;strokeColor=#2E7D32;strokeWidth=2.5;fontFamily=Nunito,Helvetica,Arial;fontSize=12;fontStyle=1;fontColor=#1B5E20;whiteSpace=wrap;html=0;align=left;spacingLeft=16;shadow=1;'
    
    almacenes = [
        ('D1', "D1 | Usuarios\n\nCuentas, credenciales y perfiles", 1200, 185, 250, 75),
        ('D2', "D2 | Publicaciones\n\nAlertas activas e históricas", 1200, 500, 250, 75),
        ('D3', "D3 | Avistamientos\n\nEventos y traza de avistamiento", 1200, 830, 250, 75),
    ]

    for did, dtext, dx, dy, dw, dh in almacenes:
        dnode = ET.SubElement(root1, 'mxCell', {
            'id': did,
            'value': dtext,
            'style': d_style,
            'vertex': '1',
            'parent': '1'
        })
        ET.SubElement(dnode, 'mxGeometry', {'x': str(dx), 'y': str(dy), 'width': str(dw), 'height': str(dh), 'as': 'geometry'})

    # --- FUNCIÓN GENERADORA DE ARISTAS CON WHITE BADGE ---
    def make_edge(edge_id, source_id, target_id, label, color, waypoints=None, exit_pt=None, entry_pt=None):
        style = (
            f"edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=0;"
            f"strokeColor={color};strokeWidth=1.8;fillColor=none;endArrow=classic;endFill=1;"
            f"fontSize=10;fontFamily=Nunito,Helvetica,Arial;fontColor=#263238;fontStyle=1;"
            f"labelBackgroundColor=#FFFFFF;spacing=2;"
        )
        if exit_pt:
            style += f"exitX={exit_pt[0]};exitY={exit_pt[1]};"
        if entry_pt:
            style += f"entryX={entry_pt[0]};entryY={entry_pt[1]};"

        edge = ET.SubElement(root1, 'mxCell', {
            'id': edge_id,
            'value': label,
            'style': style,
            'edge': '1',
            'source': source_id,
            'target': target_id,
            'parent': '1'
        })
        geo = ET.SubElement(edge, 'mxGeometry', {'relative': '1', 'as': 'geometry'})
        if waypoints:
            arr = ET.SubElement(geo, 'Array', {'as': 'points'})
            for wx, wy in waypoints:
                ET.SubElement(arr, 'mxPoint', {'x': str(wx), 'y': str(wy)})
        return edge

    # Colores semánticos
    C_IN = '#1565C0'       # Azul (Input desde Usuario)
    C_OUT = '#2E7D32'      # Verde (Output hacia Usuario)
    C_WRITE = '#D84315'    # Naranja / Óxido (Escritura almacén)
    C_READ = '#512DA8'     # Violeta / Índigo (Lectura almacén)

    # ==========================
    # 21 FLUJOS DE DATOS EXACTOS
    # ==========================

    # --- GRUPO P1 (Y = 170..280) ---
    # F01 (In): Usuario -> P1
    make_edge('F01', 'EE_USUARIO', 'P1', 'Datos de la cuenta', C_IN,
              exit_pt=(1, 0.035), entry_pt=(0, 0.20))
    # F02 (Out): P1 -> Usuario
    make_edge('F02', 'P1', 'EE_USUARIO', 'Estado del Registro', C_OUT,
              exit_pt=(0, 0.60), entry_pt=(1, 0.085))
    # F03 (Out): P1 -> Usuario
    make_edge('F03', 'P1', 'EE_USUARIO', 'Enlace de reestablecimiento de contrasenia', C_OUT,
              exit_pt=(0, 0.85), entry_pt=(1, 0.135))
    # F04 (Write): P1 -> D1
    make_edge('F04', 'P1', 'D1', 'Datos de usuario', C_WRITE,
              exit_pt=(1, 0.35), entry_pt=(0, 0.30))
    # F05 (Read): D1 -> P1
    make_edge('F05', 'D1', 'P1', 'Datos de usuario', C_READ,
              exit_pt=(0, 0.75), entry_pt=(1, 0.75))

    # --- GRUPO P2 (Y = 380..485) ---
    # F06 (In): Usuario -> P2
    make_edge('F06', 'EE_USUARIO', 'P2', 'Datos de la mascota', C_IN,
              exit_pt=(1, 0.28), entry_pt=(0, 0.30))
    # F07 (Out): P2 -> Usuario
    make_edge('F07', 'P2', 'EE_USUARIO', 'Comprobante de Publicacion', C_OUT,
              exit_pt=(0, 0.75), entry_pt=(1, 0.34))
    # F08 (Read): D1 -> P2 (Track A: X = 900)
    make_edge('F08', 'D1', 'P2', 'Datos de autor', C_READ,
              waypoints=[(900, 255), (900, 405)],
              exit_pt=(0, 0.90), entry_pt=(1, 0.25))
    # F09 (Write): P2 -> D2 (Track B: X = 960)
    make_edge('F09', 'P2', 'D2', 'Datos de publicacion', C_WRITE,
              waypoints=[(960, 455), (960, 525)],
              exit_pt=(1, 0.70), entry_pt=(0, 0.35))

    # --- GRUPO P3 (Y = 590..695) ---
    # F10 (In): Usuario -> P3
    make_edge('F10', 'EE_USUARIO', 'P3', 'Filtros asignados', C_IN,
              exit_pt=(1, 0.52), entry_pt=(0, 0.30))
    # F11 (Out): P3 -> Usuario
    make_edge('F11', 'P3', 'EE_USUARIO', 'Reportes segun filtro', C_OUT,
              exit_pt=(0, 0.75), entry_pt=(1, 0.58))
    # F12 (Read): D2 -> P3 (Track A: X = 900)
    make_edge('F12', 'D2', 'P3', 'Alertas activas', C_READ,
              waypoints=[(900, 555), (900, 640)],
              exit_pt=(0, 0.75), entry_pt=(1, 0.45))

    # --- GRUPO P4 (Y = 780..1010) — ESPACIADO CON 55PX DE SEPARACIÓN ---
    # F13 (In): Usuario -> P4
    make_edge('F13', 'EE_USUARIO', 'P4', 'Datos de la ubicacion del avistamiento', C_IN,
              exit_pt=(1, 0.72), entry_pt=(0, 0.15))
    # F14 (In): Usuario -> P4
    make_edge('F14', 'EE_USUARIO', 'P4', 'Cierre de publicacion', C_IN,
              exit_pt=(1, 0.78), entry_pt=(0, 0.35))
    # F15 (Out): P4 -> Usuario
    make_edge('F15', 'P4', 'EE_USUARIO', 'Notificacion de avistamiento', C_OUT,
              exit_pt=(0, 0.55), entry_pt=(1, 0.84))
    # F16 (Out): P4 -> Usuario
    make_edge('F16', 'P4', 'EE_USUARIO', 'Contacto del duenio', C_OUT,
              exit_pt=(0, 0.75), entry_pt=(1, 0.90))
    # F17 (Out): P4 -> Usuario
    make_edge('F17', 'P4', 'EE_USUARIO', 'Notificacion de caso resuelto', C_OUT,
              exit_pt=(0, 0.92), entry_pt=(1, 0.96))

    # Interacciones P4 con Almacenes (Tracks C, D, E y Directo)
    # F18 (Read): D1 -> P4 (Track E: X = 1140)
    make_edge('F18', 'D1', 'P4', 'Datos de contacto del titular', C_READ,
              waypoints=[(1140, 225), (1140, 910)],
              exit_pt=(0, 0.50), entry_pt=(1, 0.82))
    # F19 (Read): D2 -> P4 (Track C: X = 1020)
    make_edge('F19', 'D2', 'P4', 'Estado de publicacion', C_READ,
              waypoints=[(1020, 570), (1020, 825)],
              exit_pt=(0, 0.95), entry_pt=(1, 0.18))
    # F20 (Write): P4 -> D2 (Track D: X = 1080)
    make_edge('F20', 'P4', 'D2', 'Publicacion actualizada', C_WRITE,
              waypoints=[(1080, 855), (1080, 540)],
              exit_pt=(1, 0.40), entry_pt=(0, 0.55))
    # F21 (Write): P4 -> D3 (Directo Horizontal)
    make_edge('F21', 'P4', 'D3', 'Datos de avistamiento', C_WRITE,
              exit_pt=(1, 0.60), entry_pt=(0, 0.50))


    # ==========================================
    # PÁGINA 2: DICCIONARIO DE DATOS (DD)
    # ==========================================
    diag2 = ET.SubElement(mxfile, 'diagram', {
        'id': 'Diccionario_Datos',
        'name': '2. Diccionario de Datos'
    })
    model2 = ET.SubElement(diag2, 'mxGraphModel', {
        'dx': '1600', 'dy': '1100', 'grid': '1', 'gridSize': '10',
        'guides': '1', 'tooltips': '1', 'connect': '1', 'arrows': '1',
        'fold': '1', 'page': '1', 'pageScale': '1',
        'pageWidth': '1550', 'pageHeight': '1650', 'math': '0', 'shadow': '0'
    })
    root2 = ET.SubElement(model2, 'root')
    ET.SubElement(root2, 'mxCell', {'id': '0'})
    ET.SubElement(root2, 'mxCell', {'id': '1', 'parent': '0'})

    dd_title = "DICCIONARIO DE DATOS (DD) — SISTEMA PATITAS ENCONTRADAS\nEspecificación formal de Almacenamientos y Flujos de Datos (IEEE-830)"
    dd_hdr = ET.SubElement(root2, 'mxCell', {
        'id': 'dd_header',
        'value': dd_title,
        'style': 'text;html=0;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontFamily=Nunito,Helvetica,Arial;fontSize=15;fontStyle=1;fontColor=#2C3E50;',
        'vertex': '1',
        'parent': '1'
    })
    ET.SubElement(dd_hdr, 'mxGeometry', {'x': '380', 'y': '25', 'width': '800', 'height': '50', 'as': 'geometry'})

    # TABLA 1: ALMACENAMIENTOS (Plain text estructurado)
    t1_title = ET.SubElement(root2, 'mxCell', {
        'id': 't1_title',
        'value': "1. DICCIONARIO DE ALMACENAMIENTOS (DATA STORES)",
        'style': 'text;html=0;align=left;verticalAlign=middle;strokeColor=none;fillColor=none;fontFamily=Nunito,Helvetica,Arial;fontSize=13;fontStyle=1;fontColor=#1B5E20;',
        'vertex': '1',
        'parent': '1'
    })
    ET.SubElement(t1_title, 'mxGeometry', {'x': '80', 'y': '85', 'width': '600', 'height': '30', 'as': 'geometry'})

    t1_text = (
        "ALMACENAMIENTOS DEL SISTEMA\n"
        "========================================================================================================================\n"
        "ALMACÉN          | ATRIBUTOS (ESTRUCTURA DE CAMPOS)                               | ESCRITURA                | LECTURA\n"
        "-----------------+----------------------------------------------------------------+--------------------------+------------------------------------\n"
        "D1 Usuarios      | Id_Usuario + Correo_Electronico + Contrasenia_Hash +            | Datos de usuario         | Datos de autor,\n"
        "                 | Nombre_Apellido + Telefono_Whatsapp + Zona_Residencia +        |                          | Datos de contacto del titular,\n"
        "                 | Fecha_Registro                                                 |                          | Datos de usuario\n"
        "-----------------+----------------------------------------------------------------+--------------------------+------------------------------------\n"
        "D2 Publicaciones | Id_Reporte + Id_Usuario_Autor + Tipo_Alerta + Especie + Raza + | Datos de publicacion,    | Alertas activas,\n"
        "                 | Descripcion + {Fotos} + Latitud_Origen + Longitud_Origen +     | Publicacion actualizada  | Estado de publicacion\n"
        "                 | Recompensa + Fecha_Hora_Registro + Estado_Reporte              |                          |\n"
        "-----------------+----------------------------------------------------------------+--------------------------+------------------------------------\n"
        "D3 Avistamientos | Id_Avistamiento + Id_Reporte + Id_Usuario_Informante +         | Datos de avistamiento    | Historial de avistamientos\n"
        "                 | Fecha_Hora + Latitud + Longitud + Foto_Avistamiento +          |                          |\n"
        "                 | Mensaje_Observacion                                            |                          |\n"
        "========================================================================================================================"
    )
    t1_node = ET.SubElement(root2, 'mxCell', {
        'id': 'table_almacenes',
        'value': t1_text,
        'style': 'rounded=1;whiteSpace=pre;html=0;fillColor=#FFFFFF;strokeColor=#2E7D32;strokeWidth=1.5;fontFamily=Courier New,monospace;fontSize=11;fontColor=#1B5E20;shadow=1;align=left;spacingLeft=15;',
        'vertex': '1',
        'parent': '1'
    })
    ET.SubElement(t1_node, 'mxGeometry', {'x': '80', 'y': '120', 'width': '1380', 'height': '200', 'as': 'geometry'})

    # TABLA 2: FLUJOS DE DATOS
    t2_title = ET.SubElement(root2, 'mxCell', {
        'id': 't2_title',
        'value': "2. DICCIONARIO DE FLUJOS DE DATOS (DATA FLOWS)",
        'style': 'text;html=0;align=left;verticalAlign=middle;strokeColor=none;fillColor=none;fontFamily=Nunito,Helvetica,Arial;fontSize=13;fontStyle=1;fontColor=#1565C0;',
        'vertex': '1',
        'parent': '1'
    })
    ET.SubElement(t2_title, 'mxGeometry', {'x': '80', 'y': '345', 'width': '600', 'height': '30', 'as': 'geometry'})

    t2_text = (
        "FLUJOS DE DATOS NORMALIZADOS (20 DEFINICIONES FORMALES)\n"
        "===============================================================================================================================================\n"
        "FLUJO                           | ESTRUCTURA / ATRIBUTOS                                        | ORIGEN                     | DESTINO\n"
        "--------------------------------+---------------------------------------------------------------+----------------------------+---------------------------------\n"
        "Alertas activas                 | {Id_Reporte + Tipo_Alerta + Especie + Raza + Descripcion +    | D2 Publicaciones           | 3. Consultar mapa y feed\n"
        "                                | Foto_Portada + Latitud_Origen + Longitud_Origen + Fecha_Hora} |                            |\n"
        "Cierre de publicacion           | Id_Reporte + Id_Usuario_Autor + Motivo_Cierre                 | Usuario                    | 4. Gestionar avistamiento\n"
        "Comprobante de Publicacion      | Id_Reporte + Fecha_Hora_Registro + Estado_Reporte + Mensaje   | 2. Publicar reporte        | Usuario\n"
        "Contacto del duenio             | Id_Reporte + Nombre_Contacto + Telefono_Whatsapp + Enlace     | 4. Gestionar avistamiento  | Usuario\n"
        "Datos de autor                  | Id_Usuario + Estado_Cuenta                                    | D1 Usuarios                | 2. Publicar reporte\n"
        "Datos de avistamiento           | Id_Avistamiento + Id_Reporte + Id_Usuario_Informante +        | 4. Gestionar avistamiento  | D3 Avistamientos\n"
        "                                | Fecha_Hora + Latitud + Longitud + Foto + Mensaje_Observacion  |                            |\n"
        "Datos de contacto del titular   | Id_Usuario + Nombre_Apellido + Telefono_Whatsapp              | D1 Usuarios                | 4. Gestionar avistamiento\n"
        "Datos de la cuenta              | [Accion_Registro|Login|Recuperar] + Correo + Pass + (Nombre)  | Usuario                    | 1. Gestionar cuenta de usuario\n"
        "                                | + (Telefono_Whatsapp) + (Zona_Residencia)                     |                            |\n"
        "Datos de la mascota             | Tipo_Alerta + Especie + Raza + Descripcion + {Fotos} + GPS    | Usuario                    | 2. Publicar reporte\n"
        "                                | + (Recompensa)                                                |                            |\n"
        "Datos de la ubicacion avistam.  | Id_Reporte + Latitud + Longitud + Foto + (Mensaje)            | Usuario                    | 4. Gestionar avistamiento\n"
        "Datos de publicacion            | Id_Reporte + Id_Usuario_Autor + Tipo_Alerta + Especie + Raza  | 2. Publicar reporte        | D2 Publicaciones\n"
        "                                | + Descripcion + {Fotos} + GPS + Recompensa + Fecha + Estado    |                            |\n"
        "Datos de usuario                | Id_Usuario + Correo + Contrasenia_Hash + Nombre + Telefono    | 1. Gestionar cuenta / D1   | D1 / 1. Gestionar cuenta\n"
        "Enlace reestablecimiento pass   | Correo_Electronico + Token_Restablecimiento + URL + Expiracion| 1. Gestionar cuenta        | Usuario\n"
        "Estado del Registro             | Codigo_Estado + Descripcion_Resultado + (Id_Usuario)          | 1. Gestionar cuenta        | Usuario\n"
        "Estado de publicacion           | Id_Reporte + Id_Usuario_Autor + Estado_Reporte                | D2 Publicaciones           | 4. Gestionar avistamiento\n"
        "Filtros asignados               | Latitud_Consulta + Longitud_Consulta + Radio_Km + (Especie)   | Usuario                    | 3. Consultar mapa y feed\n"
        "Notificacion de avistamiento    | Id_Reporte + Fecha_Hora_Avistamiento + Mensaje_Aviso          | 4. Gestionar avistamiento  | Usuario\n"
        "Notificacion de caso resuelto   | Id_Reporte + Fecha_Hora_Cierre + Mensaje_Confirmacion         | 4. Gestionar avistamiento  | Usuario\n"
        "Publicacion actualizada         | Id_Reporte + Estado_Reporte + Fecha_Cierre                    | 4. Gestionar avistamiento  | D2 Publicaciones\n"
        "Reportes segun filtro           | {Id_Reporte + Tipo_Alerta + Especie + GPS + Foto + Distancia} | 3. Consultar mapa y feed   | Usuario\n"
        "==============================================================================================================================================="
    )
    t2_node = ET.SubElement(root2, 'mxCell', {
        'id': 'table_flujos',
        'value': t2_text,
        'style': 'rounded=1;whiteSpace=pre;html=0;fillColor=#FFFFFF;strokeColor=#1565C0;strokeWidth=1.5;fontFamily=Courier New,monospace;fontSize=10;fontColor=#0D47A1;shadow=1;align=left;spacingLeft=15;',
        'vertex': '1',
        'parent': '1'
    })
    ET.SubElement(t2_node, 'mxGeometry', {'x': '80', 'y': '380', 'width': '1380', 'height': '680', 'as': 'geometry'})

    return ET.tostring(mxfile, encoding='utf-8', xml_declaration=True).decode('utf-8')

if __name__ == '__main__':
    xml_content = generate_dfd_clean()
    out_path = 'docs/diagramas/DFD_Nivel_1_Patitas_Encontradas.drawio'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(xml_content)
    print(f"Diagrama limpio generado en {out_path} ({len(xml_content)} bytes)")
