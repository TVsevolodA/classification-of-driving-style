from fastapi import FastAPI
from routes.user_routes import user_router

# from create_database import create_database
# create_database()

app = FastAPI()
app.include_router(router=user_router, prefix="/user")