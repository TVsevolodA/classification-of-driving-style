import { Car } from "./car"
import { Driver } from "./driver"
import { DriverCar } from "./driverCar"

export type Trip = {
    car: Car
    driver: Driver
    driver_car: DriverCar
}