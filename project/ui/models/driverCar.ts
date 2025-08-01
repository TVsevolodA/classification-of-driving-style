export type DriverCar = {
    id: number
    driver_id: number
    car_id: number
    start_date: string
    end_date: string
    place_departure: string
    place_destination: string
    distance: number
    duration: number
    fuel_consumption: number
    violations_per_trip: number
    average_speed: number
}