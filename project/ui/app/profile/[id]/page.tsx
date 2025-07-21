import { redirect } from "next/navigation";
import requestsToTheServer from "../../../components/requests_to_the_server";
import ProfilePage from "./profile_page";
import { cookies } from "next/headers";

export default async function ProfilePageWrapper() {
    const url = "http://localhost:7000/users/me";
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    let isAuthorized;
    if ( token !== undefined ) {
        isAuthorized = await requestsToTheServer(
            url,
            "GET",
            null,
            { cookie: `token=${token.value}` }
        );
        if ( !isAuthorized.ok ) {
            redirect('/auth');
        }
    }
    else {
        redirect('/auth');
    }
    return <ProfilePage userData={isAuthorized.data} />;
}