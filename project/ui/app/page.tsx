'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:7000/tracking");

    socket.onopen = () => {
      console.log('Соединение установлено');
    };

    socket.onmessage = (event) => {
      setMessages(prev => [event.data, ...prev]);
    };

    socket.onerror = (error) => {
      console.log('Ошибка WebSocket', error);
    };

    socket.onclose = () => {
      console.log('Соединение закрыто');
    };

    return () => {
      socket.close();
    };
  });
  return (
    <div>
      <h1>Данные предсказаний</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
    </div>
  );
}

// 'use client';

// import dynamic from 'next/dynamic';

// const RouteMap = dynamic(() => import('../components/RouteMap'), {
//   ssr: false,
// });

// export default function Page() {
//   return (
//     <div>
//       <h1>Маршрут с прогрессом в Next.js</h1>
//       <RouteMap />
//     </div>
//   );
// }