#importamos las librerías 
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import bcrypt

from database import SesionLocal
from modelos.usuario import Usuario

#creamos las rutas para el registro de los usuarios
enrutador = APIRouter()
#bd: base de datos
def obtener_bd():
    bd = SesionLocal()
    try:
        yield bd
    finally:
        bd.close()
    
#una vez que el usuario se registra, se guarda en la base de datos y se le devuelve un mensaje de éxito
@enrutador.post("/registro")
def registrar_usuario(email: str, password: str, bd: Session = Depends(obtener_bd)):
    
    usuario_existente = bd.query(Usuario).filter(Usuario.email == email).first()
    
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Este email ya está registrado"
        )
    #en caso de que el usuario no exista, se encripta la contraseña y se guarda en la base de datos

    sal = bcrypt.gensalt()
    password_encriptada = bcrypt.hashpw(password.encode('utf-8'), sal).decode('utf-8')

    nuevo_usuario = Usuario(email=email, password=password_encriptada)

    bd.add(nuevo_usuario)
    bd.commit()
    bd.refresh(nuevo_usuario)

    return {"mensaje": "Usuario creado exitosamente"}