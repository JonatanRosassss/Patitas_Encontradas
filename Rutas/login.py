#importamos las librerías
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import bcrypt

#usamos la base de datos y el modelo de usuario
from database import SesionLocal
from modelos.usuario import Usuario

enrutador = APIRouter()

# creamos la función para obtener la base de datos
def obtener_bd():
    bd = SesionLocal()
    try:
        yield bd
    finally:
        bd.close()

@enrutador.post("/login")
def iniciar_sesion(email: str, password: str, bd: Session = Depends(obtener_bd)):
    
    usuario_bd = bd.query(Usuario).filter(Usuario.email == email).first()
    
    # verificamos si el usuario existe en la base de datos
    if not usuario_bd:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Credenciales inválidas"
        )

    # verificamos si la contraseña es correcta
    password_valida = bcrypt.checkpw(
        password.encode('utf-8'), 
        usuario_bd.password.encode('utf-8')
    )
    
    if not password_valida:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Credenciales inválidas"
        )

    return {"mensaje": "Autenticación exitosa", "usuario": email}
