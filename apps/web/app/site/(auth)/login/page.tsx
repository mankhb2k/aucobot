import { ClientLoginPage } from "./_components/ClientLoginPage/ClientLoginPage";

const showDevLogin = process.env.NODE_ENV === "development";

export default function LoginPage() {
  return <ClientLoginPage showDevLogin={showDevLogin} />;
}
