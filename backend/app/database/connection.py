from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.models import Base

DATABASE_URL = "sqlite:///./stanza.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """
    Takes all classes from models.py and create tables for them in stanza.db
    """
    Base.metadata.create_all(bind=engine)

def get_db():
    """
    Dependency Injection: FastAPI calls this func upon each request to API
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
