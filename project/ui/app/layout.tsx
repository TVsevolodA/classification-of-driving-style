import requestsToTheServer from "../components/requests_to_the_server";
import ClientLayout from "./client_layout";
import { UserContextProvider }  from "./user_context";
import { cookies } from 'next/headers';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let user = null;
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if ( token !== undefined ) {
    const url = 'http://localhost:7000/users/me';
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