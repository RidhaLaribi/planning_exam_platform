// import { redirect } from 'next/navigation';

// export default function Home() {
//   redirect('/login');
// }
// pages/seed.js
'use client';

import { useEffect, useState } from 'react';

export default function SeedPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seed`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Seed Result</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

