import { cookies } from "next/headers";
import requestsToTheServer from "../../components/requests_to_the_server";
import Forbidden from "../forbidden";
import DriversInfoPage from "./drivers_page";
import { redirect } from "next/navigation";
import DriversEmpty from "./not_found_users";
import { Driver, DriversData } from "../../models/driver";

function getStatistics(drivers: Driver[]) {
    const sortedByRating = [...drivers].sort((a, b) => b.driving_rating - a.driving_rating);
    const bestDriver = sortedByRating[0];
    const worstDriver = sortedByRating[sortedByRating.length - 1];
    const averageDrivers = sortedByRating.slice(1, -1);
    return {
        drivers: drivers,
        bestDriver,
        worstDriver,
        averageDrivers,
    };
}

export default async function UserInformationPage() {
    /* TODO: Здесь определять по роли что выводить:
    * Если пользователь, то водителей, с правом редактирования!
    * Иначе пользователей севисом, с правами на чтение!
    */
    let usersData: DriversData;
    // localhost
    const url = "http://gateway:7000/drivers";
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if ( token !== undefined ) {
        const res = await requestsToTheServer(
            url,
            "GET",
            null,
            { cookie: `token=${token.value}` }
        );
        if ( !res.ok ) return <Forbidden />;
        usersData = getStatistics(res.data);
    }
    else {
        redirect('/auth');
    }
    if ( usersData.drivers.length === 0 ) return <DriversEmpty />;
    return <DriversInfoPage data={usersData}/>;
}