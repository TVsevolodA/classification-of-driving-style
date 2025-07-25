from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from create_database import create_database


class CreateSession:
    session_local  = None
    def __init__(self):
        create_database()
        SQLALCHEMY_DATABASE_URL = "sqlite:///./classification_driving_style.db"
        engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
        session_local = sessionmaker(autoflush=False, bind=engine)
        CreateSession.set_db(session_local)

    @classmethod
    def set_db(cls, s):
        cls.session_local = s

    @classmethod
    def get_db(cls):
        db = cls.session_local()
        try:
            yield db
        finally:
            db.close()