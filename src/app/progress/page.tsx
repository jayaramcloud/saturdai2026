import { auth, signIn } from "@/auth";
import { getWeekProgress, getAttendance } from "@/lib/db";
import { toggleWeek, checkIn } from "./actions";

const WEEKS = [
  { week: 1, title: "LLMs" },
  { week: 2, title: "RAG" },
  { week: 3, title: "MCPs" },
  { week: 4, title: "Tool Calling" },
];

export default async function ProgressPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "4rem 2rem", textAlign: "center" }}>
        <h1 className="section-title">Your Progress</h1>
        <p className="description" style={{ margin: "0 auto 2rem" }}>
          Sign in with Google to track which weeks you&apos;ve completed and check in for
          Saturday and weekday evening sessions.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button type="submit" className="btn btn-primary">
            Sign In With Google
          </button>
        </form>
      </main>
    );
  }

  const email = session.user.email;
  const [completedWeeks, attendance] = await Promise.all([
    getWeekProgress(email),
    getAttendance(email),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const checkedInToday = attendance.includes(today);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
      <h1 className="section-title" style={{ textAlign: "center" }}>
        Your Progress
      </h1>
      <p className="description" style={{ margin: "0 auto 3rem", textAlign: "center" }}>
        Welcome back, {session.user.name?.split(" ")[0]}. Here&apos;s where you&apos;re at.
      </p>

      {/* Attendance check-in */}
      <div className="start-card" style={{ marginBottom: "3rem" }}>
        <h3 style={{ textAlign: "center" }}>Today&apos;s Session</h3>
        {checkedInToday ? (
          <p style={{ textAlign: "center", color: "#c0c0d0" }}>
            ✓ You&apos;re checked in for {today}. See you in the session!
          </p>
        ) : (
          <>
            <p style={{ textAlign: "center" }}>Joining tonight&apos;s session? Check in below.</p>
            <form action={checkIn} style={{ textAlign: "center" }}>
              <button type="submit" className="btn btn-primary">
                Check In For Today
              </button>
            </form>
          </>
        )}
        <p style={{ textAlign: "center", color: "#808099", marginTop: "1.5rem", fontSize: "0.9rem" }}>
          Total sessions attended: {attendance.length}
        </p>
      </div>

      {/* Week completion */}
      <h2 className="section-title" style={{ fontSize: "1.75rem" }}>
        Curriculum
      </h2>
      <div className="features-grid">
        {WEEKS.map(({ week, title }) => {
          const completed = completedWeeks.includes(week);
          return (
            <div className="feature-card" key={week}>
              <h3>
                Week {week}: {title}
              </h3>
              <p style={{ marginBottom: "1rem" }}>
                {completed ? "✓ Completed" : "Not completed yet"}
              </p>
              <form action={toggleWeek.bind(null, week, completed)}>
                <button type="submit" className={completed ? "btn btn-secondary btn-sm" : "btn btn-primary btn-sm"}>
                  {completed ? "Mark Incomplete" : "Mark Complete"}
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </main>
  );
}
