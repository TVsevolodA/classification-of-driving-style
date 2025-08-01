import { cookies } from "next/headers";
import requestsToTheServer from "../../components/requests_to_the_server";
import MainStreamPage from "./client_page";

export default async function LoadingMainStreamPage() {
    let trips = [];
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if ( token !== undefined ) {
        let url = 'http://localhost:7000/trips';
        let reqObject = await requestsToTheServer(url, 'GET', null, { cookie: `token=${token.value}` });
        console.log(reqObject);
        if ( reqObject.ok ) trips = reqObject.data;
    }
    return <MainStreamPage trips = { trips } />
}