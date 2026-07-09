import { redirect } from "next/navigation";

import { marketingUrl } from "@/lib/host/urls";
import { getServerUser } from "@/lib/http/server-auth";

export default async function AppHomePage() {
  const user = await getServerUser();

  if (!user) {
    redirect(marketingUrl("/login"));
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>App Home</h1>
      <p>Hello {user.name ?? user.email}</p>
    </div>
  );
}
