import { redirect } from "next/navigation";

import { ClientAppShell } from "@/components/app/ClientAppShell/ClientAppShell";
import { marketingUrl } from "@/lib/host/urls";
import { getServerUser } from "@/lib/http/server-auth";

export default async function AppHomePage() {
  const user = await getServerUser();

  if (!user) {
    redirect(marketingUrl("/login"));
  }

  const userName = user.name?.trim() || user.email;

  return <ClientAppShell userName={userName} />;
}
