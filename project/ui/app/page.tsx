export default function Page() {
  return (
    <div>
      <span>Добро пожаловать</span>
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