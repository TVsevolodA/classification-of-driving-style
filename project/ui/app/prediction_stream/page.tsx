import { cookies } from "next/headers";
import requestsToTheServer from "../../components/requests_to_the_server";
import MainStreamPage from "./client_page";

export default async function LoadingMainStreamPage() {
    let driversAndVehicles = null;
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if ( token !== undefined ) {
        const url = 'http://localhost:7000/drivers-with-vehicles';
        const reqObject = await requestsToTheServer(url, 'GET', null, { cookie: `token=${token.value}` });
        if ( reqObject.ok ) driversAndVehicles = reqObject.data;
    }
    return <MainStreamPage
            drivers = { driversAndVehicles["drivers"] }
            vehicles={ driversAndVehicles["vehicles"] }
            />
}