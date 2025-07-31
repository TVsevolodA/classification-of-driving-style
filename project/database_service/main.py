from fastapi import FastAPI

from routes.car_routes import car_router
from routes.driver_routes import driver_router
from routes.trip_routes import trip_router
from routes.user_routes import user_router

# from create_database import create_database
# create_database()

app = FastAPI()
app.include_router(router=user_router, prefix="/user")
app.include_router(router=car_router, prefix="/car")
app.include_router(router=driver_router, prefix="/driver")
app.include_router(router=trip_router, prefix="/trip")