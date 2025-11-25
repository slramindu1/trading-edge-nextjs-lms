import { redirect } from "next/navigation";
import { getSession } from "@/lib/getSession";

export async function requireUser() {
  // 🔹 Get the current session
  const session = await getSession();

  // 🔹 If no session, redirect to login
  if (!session) {
    redirect("/sign-in");
  }

  // 🔹 If user is not admin (user_type_id !== 2), redirect to not-admin page
  if (session.user.user_type_id !== 1) {
    redirect("/not-user");
  }

  // 🔹 Otherwise, session is valid and user is admin
  return session;
}
