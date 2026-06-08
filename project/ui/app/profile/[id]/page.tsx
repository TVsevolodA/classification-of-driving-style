import { redirect } from "next/navigation";
import requestsToTheServer from "../../../components/requests_to_the_server";
import ProfilePage from "./profile_page";
import { cookies } from "next/headers";
import { Driver } from "../../../models/driver";
import { Car } from "../../../models/car";

async function contactServer(requestUrl: string, typeRequest: string, token: string) {
    const result = await requestsToTheServer(
        requestUrl,
        typeRequest,
        null,
        { cookie: `token=${token}` }
    );
    return result;
}

export default async function ProfilePageWrapper() {
    // localhost
    let url = "http://gateway:7000/users/me";
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    let isAuthorized;
    let driver: Driver;
    let car: Car;
    if ( token !== undefined ) {
        isAuthorized = await contactServer(url, "GET", token.value);
        if ( !isAuthorized.ok ) {
            redirect('/auth');
        }
        // localhost
        url = "http://gateway:7000/trips/best";
        const driverCarsInfo = await contactServer(url, "GET", token.value);
        if ( driverCarsInfo.ok ) {
            driver = driverCarsInfo.data["driver"];
            car = driverCarsInfo.data["car"];
        }
        else {
            driver = {
                id: -1,
                director_id: -1,
                license_number: "",
                expiration_driver_license: "",
                full_name: "",
                phone: "",
                email: "",
                driving_experience: 0,
                issue_date: "",
                driving_rating: 0,
                number_violations: 0
            };
            car = {
                id: -1,
                vin: "",
                owner_id: -1,
                brand: "",
                model: "",
                year: 2000,
                license_plate: "",
                insurance_expiry_date: "",
                date_technical_inspection: "",
                mileage: 0
            };
        }
    }
    else {
        redirect('/auth');
    }
    return <ProfilePage userData={isAuthorized.data} driverData={driver} carData={car} />;
}
