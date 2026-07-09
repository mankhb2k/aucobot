import { ClientLoginPage } from "@/components/auth/ClientLoginPage/ClientLoginPage";

const showDevLogin = process.env.NODE_ENV === "development";

export default function LoginPage() {
  return <ClientLoginPage showDevLogin={showDevLogin} />;
}
