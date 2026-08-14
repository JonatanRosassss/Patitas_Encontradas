from sqlalchemy import Column, Integer, String
from database import Base # Importamos la plantilla que creamos anteriormente

class Usuario(Base):
    __tablename__ = "usuarios" # tablename: nombre de la tabla en la base de datos

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    #es basico, pero podemos agregar mas campos como nombre, apellido, fecha de nacimiento, etc.