import { signOut } from "@/lib/auth";

// Clears a session cookie that points at a user which no longer exists in
// the database (e.g. the account was deleted) and sends the browser back
// to /login with a clean slate.
export async function GET() {
  await signOut({ redirectTo: "/login" });
}
