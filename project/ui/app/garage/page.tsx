import { cookies } from "next/headers";
import requestsToTheServer from "../../components/requests_to_the_server";
import CarManagement from "./garage_page";
import { redirect } from "next/navigation";
import Forbidden from "../forbidden";
import { Role, User } from "../../models/user";
import { Car } from "../../models/car";

async function processRequest(url: string, jwtToken: string) {
    const response = await requestsToTheServer(
        url,
        "GET",
        null,
        { cookie: `token=${jwtToken}` }
    );
    return response;
}

export default async function ServerCarManagement() {
    // localhost
    let url = "http://gateway:7000/users/me";
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    let cars: Car[] = [];
    if ( token !== undefined ) {
        let res = await processRequest(url, token.value);
        if ( !res.ok ) return <Forbidden />;
        const userData: User = res.data;
        // localhost
        url = "http://gateway:7000" + (userData.role === Role.ADMIN ? "/cars/all" : "/cars/me");
        res = await processRequest(url, token.value);
        if ( !res.ok ) return <Forbidden />;
        cars = res.data;
    }
    else {
        redirect('/auth');
    }
    return <CarManagement userСars={cars} />;
}