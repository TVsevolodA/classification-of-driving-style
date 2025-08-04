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
    let url = "http://localhost:7000/users/me";
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
        url = "http://localhost:7000/trips/best";
        const driverCarsInfo = await contactServer(url, "GET", token.value);
        console.log(driverCarsInfo)
        if ( driverCarsInfo.ok ) {
            driver = driverCarsInfo.data["driver"];
            car = driverCarsInfo.data["car"];
        }
    }
    else {
        redirect('/auth');
    }
    return <ProfilePage userData={isAuthorized.data} driverData={driver} carData={car} />;
}
