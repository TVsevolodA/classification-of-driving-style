import { cookies } from "next/headers";
import requestsToTheServer from "../../components/requests_to_the_server";
import MainStreamPage from "./client_page";

export default async function LoadingMainStreamPage() {
    let drivers = null;
    let cars = null;
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if ( token !== undefined ) {
        let url = 'http://localhost:7000/drivers';
        let reqObject = await requestsToTheServer(url, 'GET', null, { cookie: `token=${token.value}` });
        if ( reqObject.ok ) drivers = reqObject.data;

        url = 'http://localhost:7000/cars/all';
        reqObject = await requestsToTheServer(url, 'GET', null, { cookie: `token=${token.value}` });
        if ( reqObject.ok ) cars = reqObject.data;
    }
    return <MainStreamPage
            drivers = { drivers }
            cars={ cars }
            />
}