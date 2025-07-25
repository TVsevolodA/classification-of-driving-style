# from sqlalchemy import create_engine
from fastapi import FastAPI
# from sqlalchemy.orm import sessionmaker
# from create_database import create_database
from create_session import CreateSession
from routes.user_routes import user_router



CreateSession()

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


app = FastAPI()
app.include_router(router=user_router, prefix="/user")