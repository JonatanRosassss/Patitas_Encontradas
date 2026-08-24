# aca importamos las librerias para crear la API
from fastapi import FastAPI
from database import motor_bd, Base
from Rutas import login, registro
from modelos import usuario

# creamos la base de datos y las tablas si no existen
Base.metadata.create_all(bind=motor_bd)

app = FastAPI(title="API Patitas Encontradas", version="1.0")

app.include_router(login.enrutador, prefix="/api/auth", tags=["Autenticación"])
app.include_router(registro.enrutador, prefix="/api/auth", tags=["Autenticación"])

# creamos una ruta para verificar el estado del sistema
@app.get("/", tags=["Estado del Sistema"])
def verificar_estado():
    return {"estado": "en linea", "servicio": "API Patitas Encontradas"}