import { client } from "@/lib/client";

export default async function Home() {
  const res = await client.health.$get(undefined, {
    init: {
      cache: "no-store", // Don't cache this, fetch fresh data every time
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch health check");
  }

  const data = await res.json();

  return (
    <main className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-4">Monorepo Boilerplate</h1>
      <div className="p-4 border rounded bg-gray-50">
        <p className="text-black text-sm">
          API Response: Status: {data.status} | Uptime: {data.uptime}
        </p>
      </div>
    </main>
  );
}
