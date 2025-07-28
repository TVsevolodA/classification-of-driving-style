from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


class CreateSession:

    @staticmethod
    def get_db() -> Generator:
        SQLALCHEMY_DATABASE_URL = "sqlite:///./classification_driving_style.db"
        engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
        session_local = sessionmaker(autoflush=False, bind=engine)
        db = session_local()
        try:
            yield db
        finally:
            db.close()