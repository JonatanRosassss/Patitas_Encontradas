from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

URL_BASE_DATOS = "sqlite:///./patitas.db"
#xomo base de datos usamos SQlite 

motor_bd = create_engine(URL_BASE_DATOS, connect_args={"check_same_thread": False})
SesionLocal = sessionmaker(autocommit=False, autoflush=False, bind=motor_bd)
#create_engine: para la conexión con la base de datos
#sessionmaker: crea una clase de sesión para interactuar con la base de datos

Base = declarative_base()
#Base: es la clase para todas las clases de modelo en SQLAlchemy