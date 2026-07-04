import { getCloudflareContext } from "@opennextjs/cloudflare";

async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}

export async function getWeekProgress(userEmail: string): Promise<number[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT week FROM week_progress WHERE user_email = ?")
    .bind(userEmail)
    .all<{ week: number }>();
  return results.map((r) => r.week);
}

export async function markWeekComplete(userEmail: string, week: number) {
  const db = await getDb();
  await db
    .prepare(
      "INSERT INTO week_progress (user_email, week, completed_at) VALUES (?, ?, ?) ON CONFLICT (user_email, week) DO NOTHING"
    )
    .bind(userEmail, week, new Date().toISOString())
    .run();
}

export async function unmarkWeekComplete(userEmail: string, week: number) {
  const db = await getDb();
  await db
    .prepare("DELETE FROM week_progress WHERE user_email = ? AND week = ?")
    .bind(userEmail, week)
    .run();
}

export async function getAttendance(userEmail: string): Promise<string[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT session_date FROM attendance WHERE user_email = ? ORDER BY session_date DESC")
    .bind(userEmail)
    .all<{ session_date: string }>();
  return results.map((r) => r.session_date);
}

export async function checkInToday(userEmail: string) {
  const db = await getDb();
  const today = new Date().toISOString().slice(0, 10);
  await db
    .prepare(
      "INSERT INTO attendance (user_email, session_date, checked_in_at) VALUES (?, ?, ?) ON CONFLICT (user_email, session_date) DO NOTHING"
    )
    .bind(userEmail, today, new Date().toISOString())
    .run();
  return today;
}
