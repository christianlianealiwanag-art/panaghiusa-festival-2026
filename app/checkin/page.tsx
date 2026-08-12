import { cookies } from "next/headers";
import CheckInClient from "@/components/checkin/CheckInClient";
import CheckInLogin from "@/components/checkin/CheckInLogin";

export default async function CheckInPage() {
  const cookieStore = await cookies();

  const authorized =
    cookieStore.get("checkin_authorized")?.value === "yes";

  if (!authorized) {
    return <CheckInLogin />;
  }

  return <CheckInClient />;
}