import requestsToTheServer from "../components/requests_to_the_server";
import { User } from "../models/user";
import ClientLayout from "./client_layout";
import { UserContextProvider }  from "./user_context";
import { cookies } from 'next/headers';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let user: User = null;
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if ( token !== undefined ) {
    // localhost
    const url = 'http://gateway:7000/users/me';
    const reqObject = await requestsToTheServer(url, 'GET', null, { cookie: `token=${token.value}` });
    if ( reqObject.ok ) user = reqObject.data;
  }
  return (
  <html lang="ru" suppressHydrationWarning>
    <UserContextProvider user={user}>
      <ClientLayout>
        {children}
      </ClientLayout>
    </UserContextProvider>
  </html>
  );
}