import { cookies } from "next/headers";
import requestsToTheServer from "../../components/requests_to_the_server";
import CarManagement from "./garage_page";
import { redirect } from "next/navigation";
import Forbidden from "../forbidden";

export default async function ServerCarManagement() {
    const url = "http://localhost:7000/cars/me";
        const cookieStore = await cookies();
        const token = cookieStore.get('token');
        let response;
        if ( token !== undefined ) {
            response = await requestsToTheServer(
                url,
                "GET",
                null,
                { cookie: `token=${token.value}` }
            );
            if ( !response.ok ) {
                return <Forbidden />;
            }
        }
        else {
            redirect('/auth');
        }
    return <CarManagement userСars={response.data} />;
}